import orjson
import numpy as np
from datetime import datetime
# from typing import Dict

def ratings_histogram(overall_ratings: list[dict]) -> bytes:
    """Transform list of overall rating objects into distribution histogram.
    Args:
        overall_ratings: List of overall rating objects
    Returns:
        JSON bytes containing frequency distribution
    """
    MIN_RATING = 100
    MAX_RATING = 3100
    BIN_SIZE = 100
    MAX_DEVIATION = 200
    
    num_bins = (MAX_RATING - MIN_RATING) // BIN_SIZE + 1
    freq = np.zeros(num_bins, dtype=np.int32)
    ratings = np.arange(MIN_RATING, MAX_RATING+1, BIN_SIZE, dtype=np.float32)
    
    try:
        # Pre-allocate arrays for vectorized operations
        valid_ratings = np.empty(len(overall_ratings), dtype=np.float32)
        valid_count = 0
        
        # Fast parsing loop
        for player_score in overall_ratings:
            try:
                rating = player_score.get('rating')
                deviation = player_score.get('deviation', 0)
                
                if (rating is not None and 
                    MIN_RATING <= rating <= MAX_RATING and 
                    deviation <= MAX_DEVIATION):
                    valid_ratings[valid_count] = rating
                    valid_count += 1
            except:
                continue
        
        # Trim array to actual size
        valid_ratings = valid_ratings[:valid_count]
        
        if valid_count > 0:
            # Vectorized binning
            bins = ((valid_ratings - MIN_RATING + BIN_SIZE - 1) // BIN_SIZE).astype(np.int32)
            np.add.at(freq, bins, 1)
            mean_rating = float(np.mean(valid_ratings))
        else:
            mean_rating = None

        # Check if the length of freq and ratings are the same
        if len(freq) != len(ratings): raise ValueError()
    except:
        # Return empty distribution on any error
        return orjson.dumps({
            "last_updated": datetime.now().isoformat(),
            "status": "error",
            "meanRating": None,
            "freq": [0] * num_bins,
            "ratings": ratings.astype(np.int32).tolist(),
        })

    # Return distribution data as bytes
    return orjson.dumps({
        "last_updated": datetime.now().isoformat(),
        "status": "success",
        "meanRating": mean_rating,
        "freq": freq.tolist(),
        "ratings": ratings.astype(np.int32).tolist(),
    })
