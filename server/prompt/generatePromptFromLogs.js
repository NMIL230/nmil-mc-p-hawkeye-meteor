
import { Prompt_instruction } from "./prompt/Headers/taskProposeRecognition_RidePig";
export function generatePromptFromLogs(logArray) {
    const highFrequencyLogs = logArray.filter(log => log.type === "PLAYER_LOG_HIGH_FREQUENCY");

    if (highFrequencyLogs.length === 0) {
        return "No high frequency logs available.";
    }

    const firstLog = highFrequencyLogs[0];
    const lastLog = highFrequencyLogs[highFrequencyLogs.length - 1];
    const eventLogs = logArray.filter(log => log.type === "PLAYER_LOG_EVENT");
    const startGameTime = parseInt(firstLog.info.GameTime, 10);
    const endGameTime = parseInt(lastLog.info.GameTime, 10);
    const timeDiff = (endGameTime - startGameTime) / 20;

    const movementDirectionAndDistance = calculateMovementDirectionAndDistance(firstLog.info.Location, lastLog.info.Location);

    let summary = `Over a period of ${timeDiff} seconds, a player moved ${movementDirectionAndDistance}, with their view changing from pitch: ${firstLog.info.View.pitch}, yaw: ${firstLog.info.View.yaw} to pitch: ${lastLog.info.View.pitch}, yaw: ${lastLog.info.View.yaw}.`;

    highFrequencyLogs.forEach(log => {
      const hotbarSummary = log.info['Hot-bar'] && log.info['Hot-bar'].some(item => item) ? `Hot-bar includes: ${log.info['Hot-bar'].map(item => item.type || 'empty').join(', ')}.` : '';
      const targetBlockSummary = log.info.TargetBlock ? `Targeted Block: ${Object.entries(log.info.TargetBlock).map(([key, value]) => `${key}: ${value}`).join(', ')}.` : '';
      const nearbyBlocksSummary = log.info.NearbyBlocks && Object.keys(log.info.NearbyBlocks).length ? `Nearby Blocks include: ${Object.entries(log.info.NearbyBlocks).map(([key, value]) => `${key}: ${value}`).join(', ')}.` : '';
      const biomeSummary = log.info.Biome ? `Biome: ${log.info.Biome}.` : '';
      const healthHungerSummary = `Health: ${log.info.Health}, Hunger: ${log.info.Hunger}.`;

      const individualLogSummary = [healthHungerSummary, biomeSummary, targetBlockSummary, nearbyBlocksSummary, hotbarSummary].filter(part => part).join(' ');

      summary += `\n- ${individualLogSummary}`;
    });

    if (eventLogs.length > 0) {
        summary += "\n\nEvents during this period include:";
        eventLogs.forEach(log => {
            const eventGameTime = (parseInt(log.info.GameTime, 10) - startGameTime) / 20;
            summary += `\n- After ${eventGameTime.toFixed(2)} seconds, ${log.info.Event}.`;
        });
    }
    const instruction = Prompt_instruction
    const prompt = instruction + summary;
    return prompt;
}

function calculateMovementDirectionAndDistance(startLocation, endLocation) {
    const deltaX = endLocation.x - startLocation.x;
    const deltaZ = endLocation.z - startLocation.z;
    const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ).toFixed(2);
    let direction = "";

    if (Math.abs(deltaX) > Math.abs(deltaZ)) {
        direction = deltaX > 0 ? "east" : "west";
    } else {
        direction = deltaZ > 0 ? "south" : "north";
    }

    if (deltaX !== 0 && deltaZ !== 0) {
        direction = `${deltaZ > 0 ? 'south' : 'north'}${deltaX > 0 ? '-east' : '-west'}`;
    }

    return `${distance} blocks towards ${direction}`;
}
