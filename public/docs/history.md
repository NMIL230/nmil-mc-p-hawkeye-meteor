# Hawkeye Change Log

## Hawkeye Plugin

### v0.2.2
- pom.xml changed


### v0.2.1
- Modify gitignore.
- Deployment preparation, low-energy consumption plugins.

### v0.2.0

- Added four categories for events.
- Provided more detailed event information, such as the location and type of blocks placed, as well as the tools used when breaking blocks.
- Added the `onPlayerCraftItem` event listener.
- Introduced a server performance monitoring module that tracks memory usage, TPS (ticks per second), ping, and the number of online players.
- Updated the command set.
- Documentation.

### v0.1.0

- Implemented multi-player support.
- Set up multi-scheduled tasks for each player with varying frequencies:
    - Low frequency: 1 per second.
    - High frequency: 20 per second.
    - Event-based: Triggered by events, not scheduled.
- Structured and decoupled the project.
- Established an event callback interface.

## Hawkeye-web Interface


### v0.4.0

- Batched Log Updates:
  - Accumulate logs into batches of 200 per player, rather than updating the database with each individual log.
- Scheduled Database OP:
  - Perform batch updates every 10 seconds for all players, followed by releasing memory
- Eliminate Data Loss
- Monitor Page Optimized


### v0.3.1

- Monitor page:
  - Disabled frontend ws listener for security concern
  - Changed to callbacks for updating.
  - Updating twice per second.
- Route configuration

### v0.3.0

- OpenAI Page, a hello-world Chat-gpt prompt dialog.
- Deployment preparation

### v0.2.1

- OpenAI Tested

### v0.2.0

- Provided the feature to reconnect to the Hawkeye plugin and check if the connection is successful.
- Offered a display for server performance information.
- Showed the number of logs sent from Hawkeye to ensure no data loss.
- Documentation Page
- OpenAI Test (Invalid secret key)

### v0.1.1

- Fixed an issue where loading excessive amounts of JSON on the monitor page caused crashes.
- Modified the layout of the monitor page.

### v0.1.0

- Developed a full-stack application utilizing Meteor, MongoDB, Node.js, and React.js.
- Supported multi-player functionality.
- Created a WebSocket message handler/classifier.
- Utilized a local MongoDB database.
- Structured and decoupled the project and upgraded the UI.
