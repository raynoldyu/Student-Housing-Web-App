export function calculateAverageSimilarity(targetUser, groupUsers) {
    // Calculate the average score for each personality trait across the group
    const groupAverage = groupUsers[0].map((_, i) => 
        groupUsers.reduce((acc, val) => acc + val[i], 0) / groupUsers.length
    );

    // Calculate the similarity for each trait as a percentage
    const similarityScores = groupAverage.map((avg, i) => 
        1 - (Math.abs(targetUser[i] - avg) / 6)
    );

    // Calculate the overall average similarity
    const overallSimilarity = similarityScores.reduce((acc, val) => acc + val, 0) / similarityScores.length * 100;

    return overallSimilarity.toFixed(2);
}

