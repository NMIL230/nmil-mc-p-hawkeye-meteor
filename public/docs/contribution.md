# Contribution Guide for Hawkeye

## Introduction


Hawkeye follows the development process for Spigot plugins. It is recommended to read the following tutorial before contributing: [Creating a Plugin with Maven using IntelliJ IDEA](https://www.spigotmc.org/wiki/creating-a-plugin-with-maven-using-intellij-idea/).

## Project Structure

The project consists of several Java files, each serving a specific purpose:

- `Hawkeye`: The main class of the plugin initializing components and sending data.
- `CommandController`: Handles custom commands registered by the plugin.
- `EventListenerCallback`: Defines callbacks for events.
- `ObservationSpaceGetter`: Contains methods to fetch player and environment data.
- `PlayerEventListener`: Listens to player-related events and triggers callbacks.
- `WebSocketServerController`: Manages the WebSocket server for real-time data communication.
- `Lag`: Responsible for TPS calculation.

## Adding New Observation Space Information

To add new types of observational data:

1. Insert your new method in the `ObservationSpaceGetter` file, for example:

    ```java
    public String getPlayerBiome(Player player) {
        Biome biome = player.getWorld().getBiome(player.getLocation().getBlockX(), player.getLocation().getBlockY(), player.getLocation().getBlockZ());
        return biome.toString().toLowerCase();
    }
    ```

2. Call your method within the `getPlayerObservationSpace` function to ensure the new information is stored:

    ```java
    data.put("Biome", getPlayerBiome(player));
    ```

## Adding New Event Listeners


You can create new event listeners in the `PlayerEventListener` file. For example:

```java
// Player picks up item event
@EventHandler
public void onPlayerPickupItem(PlayerPickupItemEvent event) {
    Player player = event.getPlayer();
    String eventInfo = "player" + " picked up " + event.getItem().getItemStack().getType();
    callback.handleEventInfo(player, eventInfo, "event-item");
}
```
The callback definition is in the `EventListenerCallback` file 
and is implemented in the Hawkeye file's `onEnable` method. 
When an event is triggered, the callback function will call 
`ObservationSpaceGetter` to collect other relevant information 
according to the event type and automatically send a log.

## Adding New New Log Types


To add a new type of log data to the Hawkeye plugin, follow the steps below:

1. Add a new case in the `ObservationSpaceGetter` method. For instance:

    ```java
    case "biome-only":
        data.put("Biome", getPlayerBiome(player));
        break;
    ```

   This snippet adds a new observation type that captures the biome of the player.

2. In the `Hawkeye` file, particularly within the `onPlayerJoin` method, you'll need to specify the log type that should be sent. For logs that depend on specific events, you will need to specify the log category when calling the callback function within your event listener:

    ```java
    callback.handleEventInfo(player, eventInfo, "biome-only");
    ```

   Here, `eventInfo` should be a string that contains the information relevant to the event, and "biome-only" is the category of the log that you have defined.

Make sure to adjust the above content based on the actual structure and needs of your project. This contribution guide provides a straightforward framework to help new contributors understand how to add new functionalities or data points to the Hawkeye plugin.
