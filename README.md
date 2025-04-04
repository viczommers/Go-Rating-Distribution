# Go-Rating-Distribution
## [**🔗📊 Histogram Chart Link**](https://viczommers.github.io/Go-Rating-Distribution/)
Implemented in [PR#3009](https://github.com/online-go/online-go.com/pull/), [PR#3029](https://github.com/online-go/online-go.com/pull/3029), [PR#3032](https://github.com/online-go/online-go.com/pull/3032), [PR#3037](https://github.com/online-go/online-go.com/pull/3037) 
## Rating System
Players with Rating Deviation (RD) of >200 are excluded.
Each bin point represents the count of players with ratings from (X-1)01 to X00, where X00 is included. For example, the 1600 point shows all players rated 1501-1600.<br>

## See also
- [Glicko2 Paper](http://www.glicko.net/glicko/glicko2.pdf) for method
- [goratings](https://github.com/online-go/goratings) for implementation
- [Issue #2431](https://github.com/online-go/online-go.com/issues/2431) for context

## Development Setup
```
npm install -g http-server
http-server
```
or
```
python -m http.server
```
## License
Modified for Go/Baduk Ratings, 2025-03-12<br>
This chart was adapted from the [♞ Lichess](https://github.com/lichess-org/lila), source at [ui/chart/src/chart.ratingDistribution.ts](https://github.com/lichess-org/lila/blob/master/ui/chart/src/chart.ratingDistribution.ts)<br>
Licensed under the GNU Affero General Public License v3
