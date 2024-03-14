
export function generatePromptFromLogs(logArray) {
    logArray.sort((a, b) => parseInt(a.info.GameTime, 10) - parseInt(b.info.GameTime, 10));

    logArray = logArray.filter(log => log.type === "PLAYER_LOG_HIGH_FREQUENCY" || log.type === "PLAYER_LOG_EVENT");

    if (logArray.length === 0) {
        return "No logs available.";
    }

    const highFrequencyLogs = logArray.filter(log => log.type === "PLAYER_LOG_HIGH_FREQUENCY");


    const firstLog = highFrequencyLogs[0];
    const lastLog = highFrequencyLogs[highFrequencyLogs.length - 1];
    const startGameTime = parseInt(firstLog.info.GameTime, 10);
    const endGameTime = parseInt(lastLog.info.GameTime, 10);
    const timeDiff = (endGameTime - startGameTime) / 20;

    const movementDirectionAndDistance = calculateMovementDirectionAndDistance(firstLog.info.Location, lastLog.info.Location);
    let summary = `Over a period of ${timeDiff} seconds, a player moved ${movementDirectionAndDistance}.`;


    summary += formatHighFrequencyLog(firstLog)
    logArray.forEach(log => {
        if (log.type === "PLAYER_LOG_HIGH_FREQUENCY") {
            summary += formatLightHighFrequencyLog(log);
        } else if (log.type === "PLAYER_LOG_EVENT") {
            const eventGameTime = (parseInt(log.info.GameTime, 10) - startGameTime) / 20;
            summary += `\n- After ${eventGameTime.toFixed(2)} seconds, ${log.info.Event}.`;
        }
    });
    summary += formatHighFrequencyLog(lastLog)



    return summary;
}

function formatHighFrequencyLog(log) {
    // let logSummary = `\nTime: ${log.info.Time}, GameTime: ${log.info.GameTime}, Position: ${formatLocation(log.info.Location)}, `;
    let logSummary = `\nAt GameTime: ${log.info.GameTime}, Player information: Position: ${formatLocation(log.info.Location)}, `;

    const optionalFields = ['TargetBlock', 'TargetEntity', 'NearbyBlocks', 'NearbyEntities', 'Biome', 'Health', 'Hunger', 'Equipments', 'Inventory', 'Hot-bar'].map(field => {
        let value = log.info[field];
        if (field === 'TargetBlock' || field === 'TargetEntity') {
            // 特别处理TargetBlock和TargetEntity，当它们为空或不存在时打印没有该项
            value = value && Object.keys(value).length ? `${field}: ${Object.entries(value).map(([key, val]) => `${key}: ${val}`).join(', ')}` : `${field}: No ${field}`;
        } else if (!value || (Array.isArray(value) && value.length === 0) || (Object.keys(value).length === 0 && value.constructor === Object)) {
            // 对于其他字段，如果为空或不存在，则不包括在汇总中
            return '';
        } else if (field === 'Hot-bar') {
            // 特别处理Hot-bar字段
            value = `Hot-bar includes: ${value.map(item => item.type || 'empty').join(', ')}`;
        } else if (field === 'Inventory') {
            // 特别处理Inventory字段，格式化为物品类型:数量
            value = value.filter(item => item && item.type).map(item => `${item.type}:${item.amount || 1}`).join(', ');
            value = value ? `Inventory: ${value}` : 'Empty Inventory';
        } else if (field === 'NearbyEntities') {
            // 特别处理NearbyEntities字段，只显示类型不显示序号
            value = value.length > 0 ? `NearbyEntities: ${value.join(', ')}` : '';
        } else if (field === 'NearbyBlocks') {
            // 特别处理NearbyBlocks字段，去除重复、去除air和void air，不显示坐标
            const blockTypes = Object.keys(value).filter(type => type !== 'air' && type !== 'void_air');
            const uniqueBlockTypes = [...new Set(blockTypes)];
            value = uniqueBlockTypes.length > 0 ? `NearbyBlocks: ${uniqueBlockTypes.join(', ')}` : 'No NearbyBlocks';
        } else if (typeof value === 'object') {
            // 对于对象类型的字段，转换为键值对字符串
            value = `${field}: ${Object.entries(value).map(([key, val]) => `${key}: ${val}`).join(', ')}`;
        } else {
            // 对于非对象类型的字段，直接转换为字符串
            value = `${field}: ${value}`;
        }
        return value;
    }).filter(Boolean).join(', ');

    logSummary += optionalFields;
    return logSummary;
}
function formatLightHighFrequencyLog(log) {
    // let logSummary = `\nTime: ${log.info.Time}, GameTime: ${log.info.GameTime}, Position: ${formatLocation(log.info.Location)}, `;
    let logSummary = `\nAt GameTime: ${log.info.GameTime}, Player information: , `;

    const optionalFields = ['TargetBlock', 'TargetEntity','NearbyEntities', ].map(field => {
        let value = log.info[field];
        if (field === 'TargetBlock' || field === 'TargetEntity') {
            // 特别处理TargetBlock和TargetEntity，当它们为空或不存在时打印没有该项
            value = value && Object.keys(value).length ? `${field}: ${Object.entries(value).map(([key, val]) => `${key}: ${val}`).join(', ')}` : `${field}: No ${field}`;
        } else if (!value || (Array.isArray(value) && value.length === 0) || (Object.keys(value).length === 0 && value.constructor === Object)) {
            // 对于其他字段，如果为空或不存在，则不包括在汇总中
            return '';
        } else if (field === 'NearbyEntities') {
            // 特别处理NearbyEntities字段，只显示类型不显示序号
            value = value.length > 0 ? `NearbyEntities: ${value.join(', ')}` : '';
        }
        return value;
    }).filter(Boolean).join(', ');

    logSummary += optionalFields;
    return logSummary;
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
function formatLocation(location) {
    return `(${location.x.toFixed(2)}, ${location.y.toFixed(2)}, ${location.z.toFixed(2)})`;
}