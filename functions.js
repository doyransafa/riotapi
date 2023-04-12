import fetch from 'node-fetch'
import * as global from './globals.js'
import summoner from "./summonerHelper.json" assert { type: 'json' };
import rune from "./runeHelper.json" assert { type: 'json' };


export async function getSummonerDetails(summonerName) {
    const summonerNameSpaceless = summonerName.replaceAll(' ', global.space)
    const response = await fetch(`${global.getSummonerByNameURL}${summonerNameSpaceless}?api_key=${global.apiKey}`);
    const data = await response.json()
    return data
}

export async function getGamesByType(summonerPUUID, type, count) {
    const response = await fetch(`${global.getMatchListURL}${summonerPUUID}/ids?type=${type}&count=${count}&api_key=${global.apiKey}`);
    const data = await response.json()
    // console.log(data);
    return data
}

export async function getMatchById(matchID) {
    const response = await fetch(`${global.getMatchByIdURL}${matchID}?api_key=${global.apiKey}`);
    const data = await response.json()
    // console.log(data);
    return data
}

export async function getMainStats(matchId) {
    const itemData = await fetch(global.itemJSON_URL).then(data => {return data.json()})
    const match = await getMatchById(matchId)
    const participants = await match.metadata.participants
    // console.log(participants)
    // console.log(match.metadata.matchId)
    const summonerStats = []
    
    for (let player of participants) {
        const statsDisplayed = {}
        const singleEntry = await match.info.participants.filter(gameData => {
            return gameData.puuid === player
        })
        // console.log(singleEntry)
        statsDisplayed.summonerName = singleEntry[0].summonerName
        statsDisplayed.puuid = singleEntry[0].puuid
        statsDisplayed.team = singleEntry[0].teamId === 100 ? 'Red' : 'Blue'
        statsDisplayed.win = singleEntry[0].win
        statsDisplayed.role = singleEntry[0].teamPosition
        statsDisplayed.champion = {
            name: singleEntry[0].championName,
            level: singleEntry[0].champLevel,
            img: `${global.championImageURL}${singleEntry[0].championName.replaceAll(/[\s']/g,"")}.png`
        }
        statsDisplayed.summonerSpell1 = 
        {
            id: singleEntry[0].summoner1Id, 
            name: summoner[singleEntry[0].summoner1Id].name, 
            img: `${global.summonerSpellURL}${summoner[singleEntry[0].summoner1Id].img}`
        }
        statsDisplayed.summonerSpell2 = 
        {
            id: singleEntry[0].summoner2Id, 
            name: summoner[singleEntry[0].summoner2Id].name, 
            img: `${global.summonerSpellURL}${summoner[singleEntry[0].summoner2Id].img}`
        }

        // statsDisplayed.items = [
        //     {
        //         "item0" : {
        //                 name: singleEntry[0].item0 ? itemData.data[singleEntry[0].item0].name : 'Empty',
        //                 img: `${global.itemImageURL}${singleEntry[0].item0}.png`
        //             },
        //         "item1" : {
        //                 name: singleEntry[0].item1 ? itemData.data[singleEntry[0].item1].name : 'Empty',
        //                 img: `${global.itemImageURL}${singleEntry[0].item1}.png`
        //             },
        //     }
        // ]

        statsDisplayed.itemSlot0 = {
            name: singleEntry[0].item0 ? itemData.data[singleEntry[0].item0].name : 'Empty',
            img: `${global.itemImageURL}${singleEntry[0].item0}.png`
        }
        statsDisplayed.itemSlot1 = {
            name: singleEntry[0].item1 ? itemData.data[singleEntry[0].item1].name : 'Empty',
            img: `${global.itemImageURL}${singleEntry[0].item1}.png`
        }
        statsDisplayed.itemSlot2 = {
            name: singleEntry[0].item2 ? itemData.data[singleEntry[0].item2].name : 'Empty',
            img: `${global.itemImageURL}${singleEntry[0].item2}.png`
        }
        statsDisplayed.itemSlot3 = {
            name: singleEntry[0].item3 ? itemData.data[singleEntry[0].item3].name : 'Empty',
            img: `${global.itemImageURL}${singleEntry[0].item3}.png`
        }
        statsDisplayed.itemSlot4 = {
            name: singleEntry[0].item4 ? itemData.data[singleEntry[0].item4].name : 'Empty',
            img: `${global.itemImageURL}${singleEntry[0].item4}.png`
        }
        statsDisplayed.itemSlot5 = {
            name: singleEntry[0].item5 ? itemData.data[singleEntry[0].item5].name : 'Empty',
            img: `${global.itemImageURL}${singleEntry[0].item5}.png`
        }
        statsDisplayed.itemSlot6 = {
            name: singleEntry[0].item6 ? itemData.data[singleEntry[0].item6].name : 'Empty',
            img: `${global.itemImageURL}${singleEntry[0].item6}.png`,
        }
        // statsDisplayed.mainRune = {
        //     name: rune[singleEntry[0].perks.styles[0].selections[0].perk].name,
        //     img: `${global.runeURL}${rune[singleEntry[0].perks.styles[0].selections[0].perk].img}`
        // }
        // statsDisplayed.secondaryTree = {
        //     name: rune[singleEntry[0].perks.styles[1].style].name,
        //     img: `${global.runeURL}${rune[singleEntry[0].perks.styles[1].style].img}`
        // }
        statsDisplayed.kills = singleEntry[0].kills
        statsDisplayed.deaths = singleEntry[0].deaths
        statsDisplayed.assists = singleEntry[0].assists
        statsDisplayed.KDA = `${singleEntry[0].kills}/${singleEntry[0].deaths}/${singleEntry[0].assists}`
        statsDisplayed.killPlusAssistPerDeath = (singleEntry[0].kills + singleEntry[0].assists) / singleEntry[0].deaths
        statsDisplayed.controlWards = singleEntry[0].detectorWardsPlaced
        statsDisplayed.totalCS = singleEntry[0].neutralMinionsKilled + singleEntry[0].totalMinionsKilled
        statsDisplayed.totalDamageDealtToChampions = singleEntry[0].totalDamageDealtToChampions
        statsDisplayed.totalDamageTaken = singleEntry[0].totalDamageTaken

        summonerStats.push(statsDisplayed)
    }

    const fullStats = {}
    fullStats.summonerStats = summonerStats
    fullStats.gameDuration = match.info.gameDuration
    fullStats.gameEndTimestamp = match.info.gameEndTimestamp
    fullStats.queue = match.info.queueId === 420 ? 'Ranked Solo Queue' : 'Ranked Flex Queue'
    fullStats.matchId = match.metadata.matchId
    
    // console.log(fullStats);
    return fullStats
}


export async function getAllMatches(summonerName) {
    const summonerPUUID = await getSummonerDetails(summonerName).then(data => {return data.puuid})
    const gamesArray = await getGamesByType(summonerPUUID, 'ranked', 1).then(data => {return data})
    const allMatches = []
    for (let matchId of Array.from(gamesArray)) {
        const gameStats = await getMainStats(matchId).then(data => {return data})
        allMatches.push(gameStats)
    }
    console.log(allMatches)
    return allMatches
}