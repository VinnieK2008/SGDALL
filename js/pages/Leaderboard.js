import { fetchWhichLeaderboard, fetchList, fetchScratchIds, fetchClans, fetchCountries } from '../content.js';
import { embed, localize, getLevelThumbnail, getEngineSelect, getScratchPFP, engineCompleted } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
		selectedScore: null,
		selectedEngine: null,
        selected: 0,
        engineAsked: getEngineSelect(),
		params: new URLSearchParams(document.location.search),
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
				<div style="display: flex; flex-wrap: wrap; justify-content: center; border-radius: 0.5rem; background-color: var(--color-primary); height: min-content; width: max-content; box-shadow: 0 1px 0.5rem 0 rgb(18 18 18 / 50%);">
					<button onclick="window.location.href=window.location.pathname" :class="['player', undefined].includes(params.get('type')?.toLowerCase()) ? 'leaderboard-button-active' : 'leaderboard-button'">Player</button>
					<button onclick="window.location.href='?type=Creator'" :class="params.get('type')?.toLowerCase() == 'creator' ? 'leaderboard-button-active' : 'leaderboard-button'">Creator</button>
					<button onclick="window.location.href='?type=Clan'" :class="params.get('type')?.toLowerCase() == 'clan' ? 'leaderboard-button-active' : 'leaderboard-button'">Clan</button>
					<button onclick="window.location.href='?type=Country'" :class="params.get('type')?.toLowerCase() == 'country' ? 'leaderboard-button-active' : 'leaderboard-button'" style="margin: 0.5rem;">Country</button>
				</div>
				<!-- bye <br>
                	<form action="#" class="type-label-lg">
						<div style="display: flex; align-items: center; gap: 10px;">
                    		<select class="btn" v-model="type" id="type" name="type">
                        		<option class="type-label-lg" value="Player" selected>Player</option>
                                <option class="type-label-lg" value="Creator">Creator</option>
                                <option class="type-label-lg" value="Clan">Clan</option>
                                <option class="type-label-lg" value="Country">Country</option>
                        	</select>
					    	<button class="btn" type="submit">Go!</button>
						</div>
					</form> -->
                    <br>
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg" style="color: #808080;">#{{ i + 1 }}</p>
                            </td> 
                            <td class="total" style="display: inline-flex; align-items: center; padding: 2rem;">
                                <p v-if="whichLeaderboard == 'creator'" class="type-label-lg">{{ ientry.total }}</p> 
                                <p v-else class="type-label-lg">{{ localize(ientry.total) }}</p> 
                                <img v-if="whichLeaderboard == 'creator'" src="../assets/hammer.png" height="24">
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i; selectedScore = null">
                                    <div v-if="whichLeaderboard == 'clan'">
                                        <span class="type-label-lg">
											{{ ientry.user }}
										</span>
                                    </div>
                                    <div v-else-if="whichLeaderboard == 'country'" style="align-items: center; gap: 20px;"> 
                                        <span style="display: inline-block;" class="type-label-lg">
                                            <span :class="\`fi fi-\${ientry.user.toLowerCase()}\`"></span>
											{{ isoCountries[ientry.user.toUpperCase()] }}
										</span>
                                    </div>
                                    <div v-else style="display: flex; align-items: center; gap: 20px;"> 
										<img :src="pfps[i]" width="42" height="42" style="border-radius: 10%;">
                                        <span style="display: inline-block;" class="type-label-lg">
                                            <template v-for="(country, i) in this.countries">
                                                <span v-if="this.countries[i][0].players.includes(ientry.user)" :class="\`fi fi-\${this.countries[i][0].name.toLowerCase()}\`" style="margin-right: 6px;"></span>
                                            </template>
                                            <template v-for="(clan, i) in this.clans">
											    <a v-if="clan[0].players.includes(ientry.user)" style="color: #808080;">[{{ this.clans[i][0].name }}]</a>
                                            </template>
											{{ ientry.user }}
										</span>
                                    </div>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container" style="border-collapse: separate;">
                    <div class="player" style="border-collapse: separate;">
                        <h1 style="display: inline-flex; align-items: center;">#{{ selected + 1 }} -
							<!-- playr icon New -->
							<img v-if="['VinnieK2008'].includes(entry.user)" src="../../assets/players/vinnie.svg" height="32" style="margin-left: 6px;"/>
							<img v-if="['Kevmaster04'].includes(entry.user)" src="../../assets/players/kev.svg" height="32" style="margin-left: 6px;"/>
							<img v-if="['unruffled'].includes(entry.user)" src="../../assets/players/muddy.svg" height="32" style="margin-left: 6px;"/>
							<img v-if="['ballgoballing'].includes(entry.user)" src="../../assets/players/evilpig.svg" height="32" style="margin-left: 6px;"/>
							<img v-if="['meow_wet'].includes(entry.user)" src="../../assets/players/florida.svg" height="32" style="margin-left: 6px;"/>
							<img v-if="['BLJ_BrokenGD'].includes(entry.user)" src="../../assets/players/toc.svg" height="32" style="margin-left: 6px;"/>
							<img v-if="['BLJ_Peneren'].includes(entry.user)" src="../../assets/players/peneren.svg" height="32" style="margin-left: 6px;"/>
							<img v-if="['antawng2'].includes(entry.user)" src="../../assets/players/europe.svg" height="32" style="margin-left: 6px;"/>
							<!-- i would love to not have an icon vinnie <img v-if="['cross1508'].includes(entry.user)" src="../../assets/players/bunny.svg" height="32" style="margin-left: 6px;"/> -->
						<a :href="\`https://scratch.mit.edu/users/\${entry.user}\`" target="_blank">&nbsp{{ entry.user }}</a>
						</h1>
                        <div style="display: inline-flex; align-items: center; gap: 0.5em; margin-top: -1em;">
                            <template v-for="engine in engines">
								<div @mouseenter="selectedEngine = engine" @mouseleave="selectedEngine = null" v-if="engineCompleted(entry, engine, list)" style="display: flex; justify-self: center; align-items: center; border-radius: 8px;" :style="\`border: 5px solid \${medalColorCodes[engineCompleted(entry, engine, list)]};\`">
                                	<img style="margin: 8px;" :src="engineIcons[engines.indexOf(engine)]" height="32" width="32">
								</div>
                                <!-- fetch engine progress <p style="color: white;">{{ engine }} {{ engineCompleted(entry, engine, list, true) }}</p> -->
                            </template>
                        </div>
						<p v-if="selectedEngine" style="color:#808080;">{{ selectedEngine }} {{ engineCompleted(entry, selectedEngine, list, true) }}</p>
						<p v-else style="color:#808080;">hover over a medal to see its info!</p>
                        <template v-if="entry.verified.length > 0 || entry.completed.length > 0">
                        	<h3 v-if="whichLeaderboard == 'creator' && entry.total == 1" style="display: flex; align-items: center; gap: 6px;">{{ entry.total }} creator point <img src="../assets/hammer.png" height="18"></h3>
							<h3 v-else-if="whichLeaderboard == 'creator' && entry.total != 1" style="display: flex; align-items: center; gap: 6px;">{{ entry.total }} creator points <img src="../assets/hammer.png" height="18"></h3>
							<h3 v-else-if="[...entry.verified, ...entry.completed].filter(a => a.level === [...entry.verified, ...entry.completed].reduce((min, current) => current.rank < min.rank ? current : min).level).length != 1">{{ entry.total }} - Hardests: {{ [...entry.verified, ...entry.completed].reduce((min, current) =>current.rank < min.rank ? current : min).level }} x{{ [...entry.verified, ...entry.completed].filter(a => a.level === [...entry.verified, ...entry.completed].reduce((min, current) => current.rank < min.rank ? current : min).level).length }}</h3>
							<h3 v-else>{{ entry.total }} - Hardest: {{ [...entry.verified, ...entry.completed].reduce((min, current) =>current.rank < min.rank ? current : min).level }}</h3>
                        </template>
                        <template v-if="entry.created.length > 0">
                        </template>
                        <template v-if="entry.created.length > 0">
                        <h2>Created ({{ entry.created.length}})</h2>
                        <table class="table" style="display: grid; gap: 1rem;">
                            <tr v-for="score in entry.created">
                                <td class="rank" style="text-align: end;">
                                    <p style="color: #808080;">#{{ score.rank }}</p>
                                </td>
                                <td @click="redirectLevel(score.rank); selectedScore = 'wrong'" class="level btn" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px; box-shadow: rgba(18, 18, 18, 0.5) 0px 1px 0.5rem 0px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                    <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;">{{ score.level }}</a>
                                </td>
                            </tr>
                        </table>
                        </template>
                        <template v-if="entry.verified.length > 0">
                            <h2>Verified ({{ entry.verified.length}})</h2>
                            <table class="table" style="display: grid; gap: 1rem;">
                                <tr v-for="score in entry.verified">
                                    <td class="rank" style="text-align: end;">
                                        <p style="color: #808080;">#{{ score.rank }}</p>
                                    </td>
                                    <td v-if="whichLeaderboard == 'country' || whichLeaderboard == 'clan'" @click="selectedScore = score" class="level btn" :class="score.link == selectedScore?.link ? 'lbbtnactive' : ''" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px; box-shadow: rgba(18, 18, 18, 0.5) 0px 1px 0.5rem 0px;" :style="getLevelThumbnail(score.rank - 1, list)">
										<a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;" target="_blank" :href="score.link" @click.stop>{{ score.level }}</a>
										<span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
									<td v-else @click="selectedScore = score" class="level btn" :class="score.level == selectedScore?.level ? 'lbbtnactive' : ''" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px; box-shadow: rgba(18, 18, 18, 0.5) 0px 1px 0.5rem 0px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                        <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;" target="_blank" :href="score.link" @click.stop>{{ score.level }}</a>
                                        <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </template>
                        <template v-if="entry.completed.length > 0">
                            <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                            <table class="table" style="display: grid; gap: 1rem;">
                                <tr v-for="score in entry.completed">
                                    <td class="rank">
                                        <p style="color: #808080;">#{{ score.rank }}</p>
                                    </td>
									<td v-if="whichLeaderboard == 'country' || whichLeaderboard == 'clan'" @click="selectedScore = score" class="level btn" :class="score.link == selectedScore?.link ? 'lbbtnactive' : ''" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px; box-shadow: rgba(18, 18, 18, 0.5) 0px 1px 0.5rem 0px;" :style="getLevelThumbnail(score.rank - 1, list)">
										<div class="button-holder" style="justify-content: left; margin: -1rem 0;">
											<a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;" target="_blank" :href="score.link" @click.stop>{{ score.level }}</a>
											<p style="color: #808080;"> - {{ this.list[score.rank - 1][0].records.find(player => player.link === score.link)?.user }}</p>
										</div>
										<span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                    <td v-else @click="selectedScore = score" class="level btn" :class="score.level == selectedScore?.level ? 'lbbtnactive' : ''" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px; box-shadow: rgba(18, 18, 18, 0.5) 0px 1px 0.5rem 0px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                        <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem" target="_blank" :href="score.link" @click.stop>{{ score.level }}</a>
                                        <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </template>
                        <template v-if="entry.progressed.length > 0">
                        <h2>Progressed ({{entry.progressed.length}})</h2>
                            <table class="table" style="display: grid; gap: 1rem;">
                                <tr v-for="score in entry.progressed">
                                    <td class="rank">
                                        <p style="color: #808080;">#{{ score.rank }}</p>
                                    </td>
									<td v-if="whichLeaderboard == 'country' || whichLeaderboard == 'clan'" @click="selectedScore = score" class="level btn" :class="score.link == selectedScore?.link ? 'lbbtnactive' : ''" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px; box-shadow: rgba(18, 18, 18, 0.5) 0px 1px 0.5rem 0px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                        <div class="button-holder" style="justify-content: left; margin: -1rem 0;">
											<a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;" target="_blank" :href="score.link" @click.stop>{{ score.percent }}% - {{ score.level }}</a>
											<p style="color: #808080;"> - {{ this.list[score.rank - 1][0].records.find(player => player.link === score.link)?.user }}</p>
										</div>
                                        <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                    <td v-else @click="selectedScore = score" class="level btn" :class="score.level == selectedScore?.level ? 'lbbtnactive' : ''" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px; box-shadow: rgba(18, 18, 18, 0.5) 0px 1px 0.5rem 0px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                        <a class="type-label-lg" target="_blank" style="border-collapse: collapse; border-spacing: 0rem;" :href="score.link" @click.stop>{{ score.percent }}% - {{ score.level }}</a>
                                        <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </template>
						<template v-if="this.list.flat().map((levle, i) => ({ name: levle?.name, index: i })).filter(idk => idk.name && ![...entry.verified, ...entry.completed].map(work => work.level).includes(idk.name)).length > 0">
                        <h2 style="color: #808080;">Uncompleted ({{this.list.flat().map((levle, i) => ({ name: levle?.name, index: i })).filter(idk => idk.name && ![...entry.verified, ...entry.completed].map(work => work.level).includes(idk.name)).length}})</h2>
                            <table class="table" style="display: grid; gap: 1rem;">
                                <tr v-for="score in this.list.flat().map((levle, i) => ({ name: levle?.name, index: i })).filter(idk => idk.name && ![...entry.verified, ...entry.completed].map(work => work.level).includes(idk.name))">
                                    <td class="rank">
                                        <p style="color: #808080;">#{{ (score.index / 2) + 1 }}</p>
                                    </td>
                                    <td @click="redirectLevel((score.index / 2) + 1)" class="level btn" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px; box-shadow: rgba(18, 18, 18, 0.5) 0px 1px 0.5rem 0px; filter: grayscale(1) brightness(0.5);" :style="getLevelThumbnail(score.index / 2, list)">
                                    	<a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;">{{ score.name }}</a>
                                    </td>
                                </tr>
                            </table>
                        </template>
                    </div>
                </div>
                <!-- Bro What -->
                <!-- https://discord.com/channels/1441949351470567487/1442193357752369363/1501233533023158384 -->
				<!-- i -->
				<div class="level-container" style="grid-row: 2; padding-block: 2rem;">
					<div style="display: flex; flex-direction: column; gap: 2rem; width: 100%; justify-self: center;" v-if="selectedScore && selectedScore != 'wrong'">
						<div style="display: flex; flex-direction: column; gap: 8px; width: 100%; justify-self: center;">
                    		<div class="button-holder" style="justify-content: left; align-items: end;">
                        		<h1>{{ selectedScore.level }}</h1>
								<h2 style="color: #808080; padding-bottom: 0.3rem;" v-if="entry.verified.some(score => score.link === selectedScore?.link)">verification</h2>
								<h2 style="color: #808080; padding-bottom: 0.3rem;" v-else-if="entry.completed.some(score => score.link === selectedScore?.link)">completion</h2>
								<h2 style="color: #808080; padding-bottom: 0.3rem;" v-else-if="entry.progressed.some(score => score.link === selectedScore?.link)">{{ selectedScore.percent }}%</h2>
                    		</div>
							<p v-if="entry.completed.some(score => score.link === selectedScore?.link) && (whichLeaderboard == 'country' || whichLeaderboard == 'clan')" style="color: #808080; margin-bottom: 0.5rem;">by {{ this.list[selectedScore.rank - 1][0].records.find(player => player.link === selectedScore.link)?.user }}</p>
                    		<h1 style="border-bottom: 1px solid #808080;"></h1>
						</div>
						<iframe v-if="selectedScore.link.includes('medal.tv') || selectedScore.link.includes('drive.google.com') || selectedScore.link.includes('youtube.com') || selectedScore.link.includes('youtu.be')" class="video" style="aspect-ratio: 16 / 9;" id="videoframe" :src="embed(selectedScore.link)" frameborder="0" allowfullscreen scrolling="no" allow="encrypted-media *; fullscreen *;" style="border-radius: 1rem;"></iframe>
						<p v-else>this record doesnt have embeddable video link<br><a style="color: #808080; text-decoration: underline;" :href="selectedScore.link" target="_blank">video link</a></p>
						<ul style="display: flex; justify-content: space-evenly; text-align: center; gap: 2rem;">
                        	<li style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                            	<div class="type-title-sm">Points gained</div>
                            	<p style="font-size: 1.6rem;">{{ selectedScore.score }}</p>
                        	</li>
							<li style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
							<div v-if="this.list[selectedScore?.rank - 1][0].id != null" class="type-title-sm">level links</div>
                            <div v-else-if="this.list[selectedScore?.rank - 1][0].itchLink2 != null" class="type-title-sm">level links</div>
                            <div v-else class="type-title-sm">level link</div>
                            <div class="button-holder">
                            <!-- money folder -->
								<a v-if="this.list[selectedScore?.rank - 1][0].id != null" :href="\`https://scratch.mit.edu/projects/\${this.list[selectedScore?.rank - 1][0].id}\`" target="_blank">
									<button v-if="this.list[selectedScore?.rank - 1]?.[0].id != null" class="link-button btn" style="background-color: rgba(0, 0, 0, 0); border: 3px solid #f7a935;">
										<img src="../assets/scratchS.svg" style="height: 32px;">
									</button>
								</a>
								<a v-if="this.list[selectedScore?.rank - 1][0].id != null" :href="\`https://turbowarp.org/\${this.list[selectedScore?.rank - 1][0].id}\`" target="_blank">
									<button v-if="this.list[selectedScore?.rank - 1][0].id != null" class="link-button btn" style="background-color: rgba(0, 0, 0, 0); border: 3px solid #ff4c4c;">
										<img src="../assets/turbowarpT.svg" style="height: 32px;">
									</button>
								</a>
								<a v-if="this.list[selectedScore?.rank - 1][0].itchLink != null" :href="this.list[selectedScore?.rank - 1][0].itchLink" target="_blank">
									<button v-if="this.list[selectedScore?.rank - 1][0].itchLink != null" class="link-button btn" style="background-color: rgba(0, 0, 0, 0); border: 3px solid #fa5c5c;">
										<img src="../assets/itchioShop.svg" style="height: 32px; filter: var(--the-button-on-top)">
									</button>
								</a>
								<a v-if="this.list[selectedScore?.rank - 1][0].itchLink2 != null" :href="this.list[selectedScore?.rank - 1][0].itchLink2" target="_blank">
									<button v-if="this.list[selectedScore?.rank - 1]?.[0].itchLink2 != null" class="link-button btn" style="background-color: rgba(0, 0, 0, 0); border: 3px solid #7d2e2e;">
										<p style="color: #fff; filter: var(--the-button-on-top)">LDM</p>
									</button>
								</a>
								<a v-if="this.list[selectedScore?.rank - 1][0].codetorchLink != null" :href="this.list[selectedScore?.rank - 1][0].codetorchLink" target="_blank">
									<button v-if="this.list[selectedScore?.rank - 1][0].codetorchLink != null" class="link-button btn" style="background-color: rgba(0, 0, 0, 0); border: 3px solid #993022;">
										<img src="../assets/codetorchFlame.svg" style="height: 32px;">
									</button>
								</a>
                            </div>
                        	</li>
                        	<li style="display: flex; flex-direction: column; align-items: center; gap: 1rem;" v-if="entry.verified.some(score => score.link === selectedScore?.link) && this.list[selectedScore.rank - 1][0].enj || this.list[selectedScore.rank - 1][0].enj == 0">
                            	<div class="type-title-sm">Enjoyment rating</div>
                            	<p style="font-size: 1.6rem;">{{ this.list[selectedScore.rank - 1][0].enj }}</p>
                        	</li>
							<li style="display: flex; flex-direction: column; align-items: center; gap: 1rem;" v-if="entry.completed.some(score => score.link === selectedScore?.link) && this.list[selectedScore.rank - 1][0].records.find(player => player.link === selectedScore.link)?.enj || this.list[selectedScore.rank - 1][0].records.find(player => player.link === selectedScore.link)?.enj == 0">
                            	<div class="type-title-sm">Enjoyment rating</div>
                            	<p style="font-size: 1.6rem;">{{ this.list[selectedScore.rank - 1][0].records.find(player => player.link === selectedScore.link)?.enj }}</p>
                        	</li>
                    	</ul>
					</div>
					<p v-else-if="selectedScore == 'wrong'">click on a record to see its info!<br><h3 style="color: #808080;">that was not a record bro</h3></p>
					<p v-else>click on a record to see its info!</p>
				</div>
            </div>
        </main>
    `,
    computed: {
        entry() {
			console.error(this.leaderboard);
			console.error(this.leaderboard[this.selected]);
			console.error(this.list);
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        const isoCountries = {
            'PL': "Poland",
            'VN': "Vietnam",
            'US': "United States",
            'CN': "China",
            'DE': "Germany",
            'CA': "Canada",
            'GB': "United Kingdom",
			'PH': "Philippines",
            'HK': "Hong Kong",
			'NL': "Netherlands",
            'FR': "France",
            'RU': "Russia",
            'AU': "Australia",
            'BY': "Belarus"
        };
        this.isoCountries = isoCountries;
        this.medalColorCodes = ["#242424", "#383838", "#575757", "#adadad", "#ffffff"];
        this.engines = ["GDR", "iPhone", "Pig Dash", "Spooky Dash", "CFB", "GDI", "GDH"];
        this.engineIcons = ["../assets/gdr.svg", "../assets/iphone.svg", "../assets/pig.svg", "../assets/Skull.svg", "../assets/cfb.svg", "../assets/gdi.svg", "https://upload.wikimedia.org/wikipedia/commons/8/8e/McDonalds_Hash_Brown.png"];
        let params = new URLSearchParams(document.location.search); 
        if (!params.get("type")) {
            this.whichLeaderboard = "player";
        } else {
            this.whichLeaderboard = params.get("type").toLowerCase();
        }
        const [leaderboard, err] = await fetchWhichLeaderboard();
        this.list = await fetchList();
        this.leaderboard = leaderboard;
        this.scratchIds = await fetchScratchIds();
        let players = [];
        let pfps = [];
        if (this.whichLeaderboard == "player" || this.whichLeaderboard == "creator") {
            for (let index = 0; index < leaderboard.length; index++) {
                players.push(this.leaderboard[index].user);
            }
            for (let index = 0; index < players.length; index++) {
                let findUsername = this.scratchIds.findIndex((username) => username == players[index]);
                if (findUsername == -1) {
                    console.error(`${players[index]} hasn't been added to the Scratch ID's file yet!`);
                    const res = await fetch(`https://cors.gays3xlol.workers.dev/https://api.scratch.mit.edu/users/${encodeURIComponent(players[index])}`);
                    const obj = await res.json();
                    if (obj.profile) {
                        pfps.push(`https://uploads.scratch.mit.edu/get_image/user/${obj.id}_90x90.png`);
                    } else {
                        pfps.push("https://uploads.scratch.mit.edu/get_image/user/1_90x90.png");
                    } 
                } else {  
                    pfps.push(`https://uploads.scratch.mit.edu/get_image/user/${this.scratchIds[findUsername + 1]}_90x90.png`);
                }   
            }
        }
        this.clans = await fetchClans();
        this.countries = await fetchCountries();
        console.error(this.clans);
        console.error(this.clans[1][0]);
        this.pfps = pfps;
        this.err = err;
        // Hide loading spinner
        this.loading = false;
    },
    methods: {
		redirectLevel(a) {
        	window.open(`https://sgdlist.pages.dev/?selected=${a}`, '_blank');
		},
        localize,
        getLevelThumbnail,
        getScratchPFP,
		embed,
        engineCompleted,
    },
};
