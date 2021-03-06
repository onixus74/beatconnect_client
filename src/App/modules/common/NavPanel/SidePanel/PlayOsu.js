import React, { useState, useEffect } from 'react';
import { useTheme, createUseStyles } from 'react-jss';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import renderIcons from '../../../../helpers/renderIcons';
import config from '../../../../../shared/config';

const useStyle = createUseStyles({
  a: {
    visibility: ({ visible }) => (visible ? 'visible' : 'hidden'),
    margin: '0 0 0 0',
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    ' &:active': {
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    '&:hover .indicator': {
      height: props => (props.selected ? '48px' : '24px'),
    },
    '&:active .indicator': {
      height: props => (props.selected ? '48px' : '24px'),
    },
    '&:hover .tooltiptext': {
      visibility: props => (props.expended ? 'hidden' : 'visible'),
    },
    '&:active .tooltiptext': {
      visibility: props => (props.expended ? 'hidden' : 'visible'),
    },
  },
  span: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgb(255, 255, 255)',
    fontSize: '15px',
    letterSpacing: '0.4pt',
    padding: '0px 12px',
    transition: 'transform 0.1s ease-in 0s',
    userSelect: 'none',
  },
  i: {
    marginRight: '8px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    margin: 0,
    height: props => (props.selected ? '40px' : '0px'),
    width: '3px',
    backgroundColor: ({ theme }) => theme.palette.primary.accent,
    transition: `height ${config.display.defaultTransitionDuration}`,
  },
  title: {
    visibility: props => (props.expended ? 'visible' : 'hidden'),
    whiteSpace: 'nowrap',
  },
  tooltiptext: {
    visibility: 'hidden',
    width: '120px',
    backgroundColor: ({ theme }) => theme.palette.primary.main,
    color: '#fff',
    textAlign: 'center',
    padding: '5px 5px',
    borderRadius: '6px',
    position: 'absolute',
    left: '100%',
    zIndex: 1,
  },
});

const PlayOsu = ({ onSelect, osuGamePath, ...otherProps }) => {
  const visible = osuGamePath && osuGamePath !== '';
  const theme = useTheme();
  const classes = useStyle({ ...otherProps, theme, visible });
  const [osuIsRunning, setOsuIsRunning] = useState(false);
  const listener = (_event, status) => {
    setOsuIsRunning(status);
  };
  const launchOsu = () => {
    if (osuGamePath) {
      ipcRenderer.send('start-osu', osuGamePath);
      setOsuIsRunning(true);
    }
  };
  useEffect(() => {
    ipcRenderer.send('start-pulling-osu-state');
    ipcRenderer.on('osu-is-running', listener);
    return () => ipcRenderer.removeListener('osu-is-running', listener);
  }, []);

  return (
    <a data-radium="true" className={classes.a} onClick={launchOsu} role="tab">
      <span className={`${classes.tooltiptext} tooltiptext`}>{osuIsRunning ? 'Playing !' : 'Play!'}</span>
      <span data-radium="true" className={classes.span}>
        <div className={`${classes.indicator} indicator`} />
        <div data-radium="true" className={classes.i}>
          {renderIcons({
            name: 'playButton',
            color: osuIsRunning && theme.palette.primary.accent,
            secColor: osuIsRunning && '#e3609a',
          })}
        </div>
        <span data-radium="true" className={classes.title}>
          {osuIsRunning ? 'Playing !' : 'Play !'}
        </span>
      </span>
    </a>
  );
};

const mapStateToProps = ({ settings }) => ({ osuGamePath: settings.userPreferences.osuPath });
export default connect(mapStateToProps)(PlayOsu);
