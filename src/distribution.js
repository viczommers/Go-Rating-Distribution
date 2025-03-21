export function createDummyDistrubution() {
    const MIN_RATING = 100; // min rating assumption
    const MAX_RATING = 3100; // max rating assumption
    const binSize = 100;
    const numberOfBins = Math.ceil((MAX_RATING - MIN_RATING) / binSize);
    // Create ratings array
    const ratings = Array.from({length: numberOfBins}, (_, i) => MIN_RATING + i * binSize);
    
    // Create frequency array with normal distribution
    const freq = ratings.map(r => {
        // Create a normal distribution centered at 1500 with std dev of 400
        const mean = 1500;
        const stdDev = 400;
        // Scale factor of 1000 to simulate realistic player counts
        return Math.round(1000 * Math.exp(-Math.pow(r - mean, 2) / (2 * Math.pow(stdDev, 2))));
    });

    // Calculate mean (for demonstration)
    let totalPlayers = freq.reduce((a, b) => a + b, 0);
    let weightedSum = ratings.reduce((sum, rating, i) => sum + rating * freq[i], 0);
    let meanRating = weightedSum / totalPlayers;

    return {
        freq: freq,
        ratings: ratings,
        myRating: 1500,    // Example rating
        otherRating: 1200, // Example rating
        meanRating: meanRating
    };
}

export async function createRatingDistribution() {
    // Player Ratings below & above are excluded
    const MIN_RATING = 100;  // min rating assumption
    const MAX_RATING = 3100; // max rating assumption
    const MAX_DEVIATION = 200; // max deviation filter
    const binSize = 100;     // Keep the same bin size for granularity
    
    // Calculate number of bins needed
    const numberOfBins = Math.ceil((MAX_RATING - MIN_RATING) / binSize);
    
    // Initialize arrays
    const ratings = Array.from({ length: numberOfBins }, (_, i) => MIN_RATING + i * binSize);
    const freq = new Array(numberOfBins).fill(0);
    let totalPlayers = 0;
    let sumRatings = 0;

    try {
        // Old static jsonl
        const response = await fetch('./static/ratings.jsonl').catch(() => null);
        if (response) {
            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim());
            lines.forEach(line => {
                try {
                    const data = JSON.parse(line);
                    if (data.overall?.rating) {
                        const rating = data.overall.rating;
                        const deviation = data.overall?.deviation ?? 0;  
                        // Only process ratings within the valid range
                        if (rating >= MIN_RATING && rating <= MAX_RATING && deviation <= MAX_DEVIATION) {
                            // const binIndex = Math.floor((rating - MIN_RATING) / binSize);
                            const binIndex = Math.floor((rating - MIN_RATING + binSize - 1) / binSize);
                            if (binIndex >= 0 && binIndex < numberOfBins) {
                                freq[binIndex]++;
                                totalPlayers++;
                                sumRatings += rating;
                            }
                        }
                    }
                } catch (e) {
                    console.warn('Failed to parse line:', e);
                }
            });
        }

        let meanRating = totalPlayers > 0 ? sumRatings / totalPlayers : 0;  // Calculate mean
        console.log('Total players:', totalPlayers);
        console.log('Number of bins:', numberOfBins);
        console.log('Bin size:', binSize);
        console.log('Rating range:', MIN_RATING, 'to', MAX_RATING);

        return {
            freq: freq,
            ratings: ratings,
            myRating: null,    // These can be set later if needed
            otherRating: null,  // These can be set later if needed
            meanRating: meanRating
        };
        } catch (error) {
            console.warn('Error fetching or processing JSONL:', error);
            // throw error;
        }
    }