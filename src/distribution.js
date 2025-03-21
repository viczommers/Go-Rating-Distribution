export async function createRatingDistribution() {
    try {
        // Use online-go.com instead of beta.online-go.com
        const response = await fetch('https://beta.online-go.com/termination-api/rating-histogram', {
            headers: {
                'Accept': 'application/json',
                'Origin': 'https://beta.online-go.com'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Rating histogram data:', data);

        return {
            freq: data.freq,
            ratings: data.ratings,
            myRating: null,
            otherRating: null,
            meanRating: data.mean_rating
        };
    } catch (error) {
        console.warn('Error fetching rating histogram:', error);
        return {
            freq: [],
            ratings: [],
            myRating: null,
            otherRating: null,
            meanRating: 0
        };
    }
}