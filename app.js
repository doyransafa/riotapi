import { getSummonerDetails, getGamesByType, getMatchById, getMainStats, getAllMatches } from './functions.js'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()



// getAllMatches('legolas222')

app.use(express.static('./views'));
app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded



app.get('/', (req, res) => {
    res.render('index')
})

app.get('/:summonerName', async (req, res) => {
    const summonerName = req.params.summonerName
    const data = await getAllMatches(summonerName).then(data => {return data})
    console.log(data)
    res.status(200).json(data)
}) 

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`connected with port ${PORT}`);
})
