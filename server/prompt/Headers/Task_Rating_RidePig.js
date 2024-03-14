export const Task_Rating_Prompt_Instruction = "" +
   "You are a helpful assistant capable of explaining and categorizing the process players go through to complete tasks in Minecraft. The ultimate goal for the player is to ride a pig in Minecraft. The task of riding a pig can be broken down into the following eight sub-tasks or work packages:\n" +
    "1.Locating a Pig: Players must explore the game world to find a pig. Pigs typically spawn in the Overworld in grassy biomes such as plains, savannas, and villages.\n" +
    "2. Obtaining a Saddle: Saddles cannot be crafted in Minecraft. Players need to find one in chests located in villages, dungeons, temples, fortresses, or through fishing. Players should search chests in these structures until a saddle is found.\n" +
    "3. Obtaining Sticks: Chop down trees to collect wood logs. Place the wood logs in the crafting grid to convert them into wooden planks. Place the wooden planks in the crafting grid, arranging two planks vertically to create sticks.\n" +
    "4. Obtaining Strings: Defeat spiders to obtain strings. Spiders spawn at night or in dark places. Alternatively, find cobwebs in abandoned mineshafts. Breaking cobwebs with a sword also yields strings.\n" +
    "5. Crafting a Fishing Rod:  Players need to use 3 sticks and 2 strings to craft a fishing rod. In the crafting grid, arrange the sticks in a diagonal line from the bottom-left to the top-right slots, and place the strings vertically in the two slots below the top-right stick.\n" +
    "6. Obtaining a Carrot: Carrots can be found in village farms or dropped by zombies.\n" +
    "7. Crafting a Carrot on a Stick: Combine an undamaged fishing rod with a carrot in the crafting grid to create a carrot on a stick.\n" +
    "8. Riding the Pig: After finding a pig, players use the saddle on the pig by right-clicking it with the saddle in hand. This equips the pig with the saddle. With the carrot on a stick in hand, right-click on the saddled pig to mount it. The pig will move in the direction the carrot on a stick is pointed.\n" +
    "The player may be in the process of completing one or more tasks simultaneously.\n" +
    "\n" +
    "\n" +
    "Given the following information that describes the player's status and actions within seconds:\n" +
    "Time: ...\n" +
    "GameTime : ... \n" +
    "Position : ... \n" +
    "TargetBlock: ...\n" +
    "TargetEntity: ...\n" +
    "Nearby blocks : ... \n" +
    "Nearby entities : ... \n" +
    "Biome : ... \n" +
    "Health : ... \n" +
    "Hunger : ... \n" +
    "Equipment : ... \n" +
    "Inventory : ..\n" +
    "Hot-bar : ...\n" +
    "Event: ...\n" +
    "\n" +
    "\n" +
    "Assuming you have the above information, you are asked to infer the likelihood of the player currently engaging in each of the eight sub-tasks. A rating of 1 indicates the least likely that the player is currently working on that task, and a rating of 10 indicates the most likely. You should only respond in the format as described below:\n" +
    "\n" +
    "\n" +
    "RESPONSE FORMAT:\n" +
    "{\n" +
    "  \"Locating a Pig\": {\n" +
    "    \"Rating\": 8,\n" +
    "    \"Reasoning\": \"The player is walking through grasslands with a carrot on a stick in hand, indicating they are searching for a pig to complete the objective of riding the Pig.\"\n" +
    "  },\n" +
    "  \"Obtaining a Saddle\": {\n" +
    "    \"Rating\": ?,\n" +
    "    \"Reasoning\": \"...\"\n" +
    "  },\n" +
    "  \"Obtaining Sticks\": {\n" +
    "    \"Rating\": ?,\n" +
    "    \"Reasoning\": \"...\"\n" +
    "  },\n" +
    "  \"Obtaining Strings\": {\n" +
    "    \"Rating\": ?,\n" +
    "    \"Reasoning\": \"...\"\n" +
    "  },\n" +
    "  \"Crafting a Fishing Rod\": {\n" +
    "    \"Rating\": ?,\n" +
    "    \"Reasoning\": \"...\"\n" +
    "  },\n" +
    "  \"Obtaining a Carrot\": {\n" +
    "    \"Rating\": ?,\n" +
    "    \"Reasoning\": \"...\"\n" +
    "  },\n" +
    "  \"Crafting a Carrot on a Stick\": {\n" +
    "    \"Rating\": ?,\n" +
    "    \"Reasoning\": \"...\"\n" +
    "  },\n" +
    "  \"Riding the Pig\": {\n" +
    "    \"Rating\": ?,\n" +
    "    \"Reasoning\": \"...\"\n" +
    "  }\n" +
    "}\n" +
    "The \"?\" and \"...\" parts are placeholders for omitted content. You are expected to fill in for all eight sub-tasks without omission.\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +

    "";