import 'https://cdn.jsdelivr.net/npm/chart.js';
import 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels';
import 'https://code.jquery.com/jquery-3.6.0.min.js';
import { createRatingDistribution } from './distribution.js';
import { initModule } from './chart.js';

// Initialize everything when document is ready
$(document).ready(async function() {
    try {
        const distribution = await createRatingDistribution();
        console.log('Ratings:', distribution.ratings);
        console.log('Frequencies:', distribution.freq);

        const data = {
            freq: distribution.freq,
            ratings: distribution.ratings, 
            myRating: 1000,
            otherRating: 500,
            meanRating: distribution.meanRating
        };
        initModule(data);
    } catch (error) {
        console.error('Failed to initialize chart:', error);
    }
});