module.exports = {
  targetServer: 'osuMain',
  prefix: '!',
  autoBeat: true,
  irc: {
      server: 'irc.ppy.sh',
      port: 6667,
      username: '',
      password: '',
      isBotAccount: false,
      _comment: 'Above option will limit amount of messages sent at the same time in order to avoid your account getting silenced if set to \'false\' '
  },
  osuApi: {
      key: ''
  },
  beatconnectAPI: {
      key: ''
  },
  _comment: 'Below you can change how a command is called in the chat and its description',
  commands: [
      {
          command: 'createRoom <name>',
          description: 'Create a multiplayer room with the specified name and send you an invite once the room is ready'
      },
      {
          command: 'search <beatmap name>',
          description: 'Search for beatmaps and return the 5 first occurences'
      },
      {
          command: 'get <beatmapId>',
          description: 'Return the download link for the requested beatmapId'
      },
      {
          command: 'pp <beatmapId>',
          description: 'Return the pp value for the requested beatmapId'
      },
      {
          command: 'beat',
          description: 'From a multiplayer lobby previously created with createRoom, return the download link of the current beatmap'
      },
      {
          command: 'infos',
          description: 'Print available commands'
      }
  ]
}