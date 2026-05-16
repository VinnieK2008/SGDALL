import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = '/data';

export async function fetchList() {
    let params = new URLSearchParams(document.location.search); 
    let whichList = params.get("list");
    let listFileName = "_list";
    console.log(whichList);
    if (whichList != null) {
        if (whichList == "challenge") {
            listFileName = "_challenge-list";
        } else if (whichList == "nsgdc") {
            listFileName = "_nsgdc-list";
        } else if (whichList == "maybenew") {
            listFileName = "_maybenewlist";
        } else if (whichList == "eh") {
            listFileName = "_eh";
        }
    }
    console.log(listFileName);
    const listResult = await fetch(`${dir}/${listFileName}.json`);
    try {
        const list = await listResult.json();
        return await Promise.all(
            list.map(async (path, rank) => {
                const levelResult = await fetch(`${dir}/${path}.json`);
                try {
                    const level = await levelResult.json();
                    return [
                        {
                            ...level,
                            path,
                            records: level.records.sort(
                                (a, b) => b.percent - a.percent,
                            ),
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load level #${rank + 1} ${path}.`);
                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load list.`);
        return null;
    }
}
export async function fetchPacks() {
    const packsResult = await fetch(`${dir}/_packs.json`);
    try {
        const packs = await packsResult.json();
        return await Promise.all(
            packs.map(async (path, rank) => {
                console.error(`${dir}/packs/${path}.json`);
                const packResult = await fetch(`../data/packs/${path}.json`);
                try {
                    const pack = await packResult.json();
                    return [
                        {
                            ...pack,
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load pack #${rank + 1} ${path}.`);
                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load packs.`);
        return null;
    }
}
export async function fetchClans() {
    const clansResult = await fetch(`${dir}/_clans.json`);
    try {
        const clans = await clansResult.json();
        return await Promise.all(
            clans.map(async (path, i) => {
                console.error(`${dir}/clans/${path}.json`);
                const clanResult = await fetch(`../data/clans/${path}.json`);
                try {
                    const clan = await clanResult.json();
                    return [
                        {
                            ...clan,
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load clan #${i + 1} ${path}.`);
                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load clans.`);
        return null;
    }
}
export async function fetchCountries() {
    const countriesResult = await fetch(`${dir}/_countries.json`);
    try {
        const countries = await countriesResult.json();
        return await Promise.all(
            countries.map(async (path, i) => {
                console.error(`${dir}/countries/${path}.json`);
                const countryResult = await fetch(`../data/countries/${path}.json`);
                try {
                    const country = await countryResult.json();
                    return [
                        {
                            ...country,
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load country #${i + 1} ${path}.`);
                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load countries.`);
        return null;
    }
}
export async function fetchEditors() {
    try {
        const editorsResults = await fetch(`${dir}/_editors.json`);
        const editors = await editorsResults.json();
        return editors;
    } catch {
        return null;
    }
}
export async function fetchTags() {
    try {
        const tagsResults = await fetch(`${dir}/_tags.json`);
        const tags = await tagsResults.json();
        return tags;
    } catch {
        return null;
    }
}
export async function fetchDidYouKnow() {
    try {
        const didYouKnowResults = await fetch(`${dir}/_didyouknow.json`);
        const didYouKnows = await didYouKnowResults.json();
        return didYouKnows;
    } catch {
        return null;
    }
}
export async function fetchChangelog() {
    try {
        const changelogResults = await fetch(`${dir}/_changelog.json`);
        const changelog = await changelogResults.json();
        return changelog;
    } catch {
        return null;
    }
}
export async function fetchSwagger() {
    try {
        const swaggerResults = await fetch(`${dir}/_players.json`);
        const swagger = swaggerResults.json();
        console.error("h1");
        console.log(swagger);
        console.log(swaggerResults);
        console.log(swaggers);
        return swagger;
    } catch {
        return null;
    }
}
export async function fetchScratchIds() {
    try {
        const fetchIds = await fetch(`${dir}/_scratch-ids.json`);
        const ids = fetchIds.json();
        console.log(fetchIds);
        console.log(ids);
        return ids;
    } catch {
        return null;
    }
}
export async function fetchWhichLeaderboard() {
    let params = new URLSearchParams(document.location.search); 
    if (!params.get("type")) {
        return await fetchLeaderboard();
    }
    let whichLeaderboard = params.get("type").toLowerCase() || "h";
    if (whichLeaderboard == 'clan') {
        return await fetchClanLeaderboard();
    } else if (whichLeaderboard == 'creator') {
        return await fetchCreatorLeaderboard();
    } else if (whichLeaderboard == 'country') {
        return await fetchCountryLeaderboard();
    } else {
        return await fetchLeaderboard();
    }
}
export async function fetchLeaderboard() {
    const list = await fetchList();

    const scoreMap = {};
    const errs = [];
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        // Verification
        const verifier = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.verifier.toLowerCase(),
        ) || level.verifier;
        scoreMap[verifier] ??= {
            verified: [],
            completed: [],
            progressed: [],
            created: [],
        };
        const { verified } = scoreMap[verifier];
        verified.push({
            rank: rank + 1,
            level: level.name,
            score: score(rank + 1, 100, level.percentToQualify),
            link: level.verification,
            engine: level.engine,
        });

        // Records
        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;
            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
                created: [],
            };
            const { completed, progressed } = scoreMap[user];
            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: record.link,
                    engine: level.engine,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: score(rank + 1, record.percent, level.percentToQualify),
                link: record.link,
            });
        });
        
        // Creator
        for (let index = 0; index < level.creators.length; index++) {      
            const creator = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.creators.map(creator => creator.toLowerCase()),
            ) || level.creators[index];
            scoreMap[creator] ??= {
                verified: [],
                completed: [],
                progressed: [],
                created: [],
            };  
            const { created } = scoreMap[creator];
            created.push({
                rank: rank + 1,
                level: level.name,
                score: 0,
                link: level.verification,
            });
        }
    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { created, verified, completed, progressed } = scores;
        const total = [created, verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return [res.sort((a, b) => b.total - a.total), errs];
}
export async function fetchCreatorLeaderboard() {
    const list = await fetchList();

    const scoreMap = {};
    const errs = [];
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        // Verification
        const verifier = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.verifier.toLowerCase(),
        ) || level.verifier;
        scoreMap[verifier] ??= {
            verified: [],
            completed: [],
            progressed: [],
            created: [],
        };
        const { verified } = scoreMap[verifier];
        verified.push({
            rank: rank + 1,
            level: level.name,
            score: 0,
            link: level.verification,
        });

        // Records
        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;
            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
                created: [],
            };
            const { completed, progressed } = scoreMap[user];
            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: 0,
                    link: record.link,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: 0,
                link: record.link,
            });
        });
        
        // Creator
        for (let index = 0; index < level.creators.length; index++) {      
            const creator = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.creators.map(creator => creator.toLowerCase()),
            ) || level.creators[index];
            scoreMap[creator] ??= {
                verified: [],
                completed: [],
                progressed: [],
                created: [],
            };  
            const { created } = scoreMap[creator];
            created.push({
                rank: rank + 1,
                level: level.name,
                score: 1,
                link: level.verification,
            });
        }
    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { created, verified, completed, progressed } = scores;
        const total = [created, verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);
            

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return [res.sort((a, b) => b.total - a.total), errs];
}

export async function fetchClanLeaderboard() {
    const list = await fetchList();
    const clans = await fetchClans();
    const scoreMap = {};
    const errs = [];
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }
        // Verification
        for (let index = 0; index < clans.length; index++) {
            const verifier = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === level.verifier.toLowerCase(),
            ) || level.verifier;
            if ((clans[index][0].players.includes(verifier))) {
                const clan = clans[index][0].name;
                scoreMap[clan] ??= {
                    verified: [],
                    completed: [],
                    progressed: [],
                    created: [],
                };
                const { verified } = scoreMap[clan];
                    verified.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: level.verification,
                });
            }


        // Records
        
        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;
            if ((clans[index][0].players.includes(user))) {
            const clan = clans[index][0].name;
            scoreMap[clan] ??= {
                verified: [],
                completed: [],
                progressed: [],
                created: [],
            };
            const { completed, progressed } = scoreMap[clan];
            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: record.link,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: score(rank + 1, record.percent, level.percentToQualify),
                link: record.link,
            });
        }
        });
    }

    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return [res.sort((a, b) => b.total - a.total), errs];
}
export async function fetchCountryLeaderboard() {
    const list = await fetchList();
    const countries = await fetchCountries();
    const scoreMap = {};
    const errs = [];
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }
        // Verification
        for (let index = 0; index < countries.length; index++) {
            const verifier = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === level.verifier.toLowerCase(),
            ) || level.verifier;
            if ((countries[index][0].players.includes(verifier))) {
                const country = countries[index][0].name;
                scoreMap[country] ??= {
                    verified: [],
                    completed: [],
                    progressed: [],
                    created: [],
                };
                const { verified } = scoreMap[country];
                    verified.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: level.verification,
                });
            }


        // Records
        
        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;
            if ((countries[index][0].players.includes(user))) {
            const country = countries[index][0].name;
            scoreMap[country] ??= {
                verified: [],
                completed: [],
                progressed: [],
                created: [],
            };
            const { completed, progressed } = scoreMap[country];
            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: record.link,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: score(rank + 1, record.percent, level.percentToQualify),
                link: record.link,
            });
        }
        });
    }

    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return [res.sort((a, b) => b.total - a.total), errs];
}
export async function fetchScratchPFPs() {
    const list = await fetchList();

    const scoreMap = {};
    const errs = [];
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }
        for (let index = 0; index < level.creators.length; index++) {      
            const creator = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.creators.map(creator => creator.toLowerCase()),
            ) || level.creators[index];
            scoreMap[creator] ??= {
                verified: [],
                completed: [],
                progressed: [],
            };  
            const { verified } = scoreMap[creator];
            verified.push({
                rank: rank + 1,
                level: level.name,
                score: 1,
                link: level.verification,
            });
        }

 
    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return [res.sort((a, b) => b.total - a.total), errs];
}
