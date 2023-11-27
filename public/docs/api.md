# API

Hawkeye is a Spigot server plugin designed to collect various types 
of information from players within the game, establishing a WebSocket server to send this information in JSON format
to a specified port. The following content explains the data format and details of the interface.

## Parameter Definitions

---

- <span style="color: orange;">**`OBSERVATION_RADIUS`**</span>: This parameter defines the radius around the player within which certain data is collected, such as nearby entities and blocks.
- <span style="color: orange;">**`MAX_TARGET_DISTANCE`**</span>: This parameter specifies the maximum distance at which a player can target a block or an entity for it to be considered in logging.

## Information Collected

---

- **Event**: Captures specific detailed string about the in-game event that occurred.
    - Example: `"player Steve interacted with block DIRT at [x=100, y=64, z=200]"`

- **Health**: Represents the player's current health level in the game.
    - Example: `20` (Maximum health for a player)

- **Hunger**: Indicates the player's current hunger level.
    - Example: `16` (Out of a maximum of 20)

- **Location**: Provides the player's exact location in the game world as a vector.
    - Example: `Vector{x=100, y=64, z=200}`

- **View**: Details the player's current yaw and pitch, reflecting their viewing direction.
    - Example: `{yaw=0.0, pitch=0.0}` (Looking straight forward)

- **TargetBlock**: Identifies the type of block the player is currently targeting, if any. Uses <span style="color: orange;">**`MAX_TARGET_DISTANCE`**</span> to determine the targetable distance.
    - Example: `"stone"` (If the player is looking at a stone block within <span style="color: orange;">**`MAX_TARGET_DISTANCE`**</span>)

- **TargetEntity**: Names the type of entity the player is currently targeting, if any. Uses <span style="color: orange;">**`MAX_TARGET_DISTANCE`**</span> to determine the targetable distance.
    - Example: `"cow"` (If the player is looking at a cow within <span style="color: orange;">**`MAX_TARGET_DISTANCE`**</span>)

- **NearbyEntities**: Lists entities that are within a certain radius of the player. Uses <span style="color: orange;">**`OBSERVATION_RADIUS`**</span> to define this radius.
    - Example: `{"cow", "sheep", "chicken"}` (Entities within <span style="color: orange;">**`OBSERVATION_RADIUS`**</span> of the player)
    
- **NearbyBlocks**: Enumerates blocks within a specific radius of the player. Uses <span style="color: orange;">**`OBSERVATION_RADIUS`**</span> to define this radius.
    - Example: `{"stone", "dirt", "grass"}` (Blocks within <span style="color: orange;">**`OBSERVATION_RADIUS`**</span> of the player)

- **Biome**: Indicates the biome type where the player is currently located.
    - Example: `"forest"`

- **Hot-bar**: Shows items present in the player's hot-bar, including their types and quantities.
  - Example: `[{"type":"IRON_SWORD", "amount":1}, {"type":"BREAD", "amount":5}]`

- **Inventory**: Provides a simplified list of items in the player's inventory, including item types and quantities.
    - Example: `[{"type":"IRON_ORE", "amount":20}, {"type":"COAL", "amount":32}]`

- **Equipments**: Lists equipment worn by the player, including items in the main and off-hand.
    - Example: `{helmet:"iron_helmet", chestplate:"diamond_chestplate", leggings:"leather_leggings", boots:"chainmail_boots", main_hand:"diamond_sword", off_hand:"shield"}`

## Log Types and Details

---
### 1. High Frequency Logs
**Logged Information:**
- Health
- Hunger
- Location
- View
- TargetBlock
- TargetEntity
- NearbyEntities
- Hot-bar

### 2. Low Frequency Logs
**Logged Information:**
- NearbyBlocks
- Biome

### 3. Event-Interact Logs
**Logged Information:**
- Event
- TargetBlock
- TargetEntity

**Event Listeners and Event Strings:**
- `onPlayerInteract`: Triggered when a player interacts with a block.
    - Event String: "player Steve interacted with block DIRT at [x=100, y=64, z=200]"
- `onPlayerInteractEntity`: Activated when a player interacts with an entity.
    - Event String: "player Alex interacted with entity COW"
- `onPlayerShearEntity`: Occurs when a player shears an entity, like a sheep.
    - Event String: "player Steve sheared entity SHEEP"

### 4. Event-Block Logs
**Logged Information:**
- Event
- TargetBlock
- NearbyBlocks

**Event Listeners and Event Strings:**
- `onBlockBreak`: Activated when a player breaks a block.
    - Event String: "player Steve broke block STONE at [x=120, y=65, z=210]"
- `onBlockDamage`: Triggered when a player damages a block.
    - Event String: "player Alex damaged block OAK_LOG at [x=110, y=70, z=205] using DIAMOND_AXE"
- `onBlockPlace`: Occurs when a player places a block.
    - Event String: "player Steve placed block GRASS_BLOCK at [x=130, y=75, z=215]"

### 5. Event-Item Logs
**Logged Information:**
- Event
- Hot-bar
- Inventory
- Equipments

**Event Listeners and Event Strings:**
- `onPlayerItemConsume`: Triggered when a player consumes an item.
    - Event String: "player Alex consumed item BREAD"
- `onPlayerItemHeld`: Activated when a player changes the item held in their hand.
    - Event String: "player Steve changed held item to IRON_SWORD"
- `onPlayerDropItem`: Occurs when a player drops an item.
    - Event String: "player Alex dropped item COBBLESTONE"
- `onPlayerPickupItem`: Triggered when a player picks up an item.
    - Event String: "player Steve picked up item OAK_LOG"
- `onInventoryClick`: Activated when a player clicks in their inventory.
    - Event String: "player Alex clicked in inventory at slot 5"
- `onPlayerCraftItem`: Occurs when a player crafts an item.
    - Event String: "player Steve crafted item BREAD x3"

### 6. Event-Fight Logs
**Logged Information:**
- Event
- Health
- Hunger
- TargetEntity
- NearbyEntities
- Hot-bar
- Equipments

**Event Listeners and Event Strings:**
- `onEntityDamageByEntity`: Triggered when a player attacks an entity.
    - Event String: "player Steve attacked entity ZOMBIE"
- `onEntityDamage`: Activated when a player receives damage.
    - Event String: "player Alex got hurt by cause FALL"

## JSON Format

---
- title: "PLAYER_LOG_EVENT"
- data: 
  - player: "deadcat8",
  - log:
    - Health: 20
    - Event: "player deadcat8 got hurt by cause FALL"
    - ...
