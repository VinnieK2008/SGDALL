import { store } from "../main.js";
import { embed, getEngineSelect, getSelectSelect, doStuff, getThumbnailImage, incVisits, getYoutubeIdFromUrl, getLevelThumbnail, listLevelNameFilter, engiCalc} from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList, fetchPacks, fetchChangelog, fetchTags } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};
export default {
    components: { Spinner, LevelAuthors },
    template: `
	<!-- :style="level?.name ? { background: 'var(--color-background-list)' } : {}" -->
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <div style="display: flex; justify-content: center; align-items: center;">
                    <input v-model="searchQuery" placeholder="Input text to Filter! here..." class="btn" type="text" id="filterForLevelName" style="width: 80%;">
                    <button style="width: 20%; height: 20%; display: none;" class="btn">
                        <img src="assets/filter.svg" alt="filter" style="width: 100%; color: var(--color-on-primary);">
                    </button>
                    <div style="border-radius: 1em; padding: 1em; background-image: var(--color-background); outline: solid 0.2em var(--color-on-primary); display: none;">
                        <h1 style="text-align: center; margin-bottom: 0.5em;">Tags</h1>
                        <template v-for="tag in tags">
							<button class="leaderboard-button" style="margin: 0.2em;"><clw>{{ tag }}</clw></button>
						</template>
                    </div>
                </div>
                <table class="list" v-if="list && list.length">
                    <tr v-for="(item, i) in filteredListDisplay" :key="item.originalIndex">
                        <template v-if="engineAsked == null">
                            <td class="rank">
                                <p v-if="item.originalIndex + 1 <= 150" class="type-label-lg" style="color: #808080;">#{{ item.originalIndex + 1 }}</p>
                                <p v-else class="type-label-lg" style="color: #808080;">Legacy</p>
                            </td>
                            <td class="level" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }">
                                <button id="levelThumbnailReal" @click="selected = item.originalIndex" style="background-color: rgb(255 0 0 / 0); width: 90%; margin: 0.5em;" :style="getLevelThumbnail(item.originalIndex, list)" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }" class=" btnlvl">
                                    <span class="type-label-lg">{{ item.level?.name || \`Error (\${item.err}.json)\` }}</span>
                                    <span class="type-label-sm">verified by {{ item.level?.verifier || "???" }}</span>
                                </button>
                            </td>
                         </template>
                        <template v-else-if="item">
                        <template v-if="engineAsked == item.level.engine">
                                <td class="rank">
                                    <p v-if="item.originalIndex + 1 <= 150" class="type-label-lg" style="color: #808080;">#{{ item.originalIndex + 1 }}</p>
                                    <p v-else class="type-label-lg" style="color: #808080;">Legacy</p>
                                </td>
                                <td class="level" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }">
                                    <button id="levelThumbnailReal" @click="selected = item.originalIndex" style="background-color: rgb(255 0 0 / 0); width: 90%; margin: 0.5em;" :style="getLevelThumbnail(item.originalIndex, list)" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }" class=" btnlvl">
                                        <span class="type-label-lg">{{ item.level?.name || \`Error (\${item.err}.json)\` }}</span>
                                        <span class="type-label-sm">Verified by {{ item.level?.verifier || "???" }}</span>
                                        <!-- oh okay -->
                                </button>
                                </td>
                            </template>
                        </template>
                    </tr>
                </table>
                
                <p v-if="list && list.length > 0 && filteredListDisplay && filteredListDisplay.length === 0" class="type-body-lg">
					<br>
                    No levels found matching your search.
                </p>
            </div>
            <div class="level-container">
			<a v-if="level" @click="selected = null">
            	<img src="../assets/back.svg" style="filter: brightness(0.5); height: 1.5rem;">
            </a>
                <div class="level" v-if="level">
					<div style="display: flex; flex-direction: column; gap: 8px; width: 100%; justify-self: center;">
                    <div class="button-holder">
                        <h1>{{ level.name }}</h1>
						<img :src="getDemonDifficulty" height="32" style="margin-left: auto;">
                    </div>
                    <h1 style="border-bottom: 1px solid #808080;"></h1>
					<p class="desc" v-if="level.description" v-html="level.description" style="padding-top: 8px;"></p>
					</div>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier" :engine="level.engine"></LevelAuthors>
                    <div v-if="level.tags" style="display: flex; margin: -1.3rem 0;">
                        <template v-for="tag in level.tags">
                            <button class="leaderboard-button"><clw>{{ tag }}</clw></button>
                        </template>
                    </div>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0" allowfullscreen scrolling="no" allow="encrypted-media *; fullscreen *;" style="border-radius: 1rem;"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p style="font-size: 1.6rem;">{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div v-if="level.scratchLink != null" class="type-title-sm">Links</div>
                            <div v-else-if="level.itchLink2 != null" class="type-title-sm">Links</div>
                            <div v-else class="type-title-sm">Link</div>
                            <div class="button-holder">
                            <!-- money folder -->
								<a v-if="level.id != null" :href="\`https://scratch.mit.edu/projects/\${level.id}\`" target="_blank">
									<button v-if="level.id != null" class="link-button btn" style="background-color: rgba(0, 0, 0, 0); border: 3px solid #f7a935;">
										<img src="../assets/scratchS.svg" style="height: 32px;">
									</button>
								</a>
								<a v-if="level.id != null" :href="\`https://turbowarp.org/\${level.id}\`" target="_blank">
									<button v-if="level.id != null" class="link-button btn" style="background-color: rgba(0, 0, 0, 0); border: 3px solid #ff4c4c;">
										<img src="../assets/turbowarpT.svg" style="height: 32px;">
									</button>
								</a>
								<a v-if="level.itchLink != null" :href="level.itchLink" target="_blank">
									<button v-if="level.itchLink != null" class="link-button btn" style="background-color: rgba(0, 0, 0, 0); border: 3px solid #fa5c5c;">
										<img src="../assets/itchioShop.svg" style="height: 32px; filter: var(--the-button-on-top)">
									</button>
								</a>
								<a v-if="level.itchLink2 != null" :href="level.itchLink2" target="_blank">
									<button v-if="level.itchLink2 != null" class="link-button btn" style="background-color: rgba(0, 0, 0, 0); border: 3px solid #7d2e2e;">
										<p style="color: #fff; filter: var(--the-button-on-top)">LDM</p>
									</button>
								</a>
								<a v-if="level.codetorchLink != null" :href="level.codetorchLink" target="_blank">
									<button v-if="level.codetorchLink != null" class="link-button btn" style="background-color: rgba(0, 0, 0, 0); border: 3px solid #993022;">
										<img src="../assets/codetorchFlame.svg" style="height: 32px;">
									</button>
								</a>
									<!--
									
								<a v-if="level.id != null" :href="\`https://scratch.mit.edu/projects/\${level.id}\`" target="_blank">
                                	<button class="link-button" style="background-color: #f7a935; border-color: #f7a935;">
										<img src="../assets/scratchS.svg" class="button-center" style="width:70%; ">
									</button>
                                </a>
                                <a v-if="level.id != null" :href="\`https://turbowarp.org/\${level.id}\`" target="_blank">
                                	<button class="link-button" style="background-color: #ff4c4c; border-color: #ff4c4c;">
										<img src="../assets/turbowarpT.svg" class="button-center" style="width:110%;">
									</button>
                                </a>
                                <a v-if="level.itchLink != null" :href="level.itchLink" target="_blank">
                                	<button class="link-button" style="background-color: #fa5c5c; border-color: #fa5c5c;">
										<img src="../assets/itchioShop.svg" class="button-center" style="width:100%;"></button>
                                </a>
                                <a v-if="level.itchLink2 != null" :href="level.itchLink2" target="_blank">
                                	<button class="link-button" style="background-color: #7d2e2e; border-color: #7d2e2e;">
                                    	<p class="button-center" style="width: 100%; color: #fff;">LDM</p>
									</button>
                                </a>            
                                <a v-if="level.codetorchLink != null" :href="level.codetorchLink" target="_blank">
                                    <button class="link-button" style="background-color: #993022; border-color: #993022;">
                                        <img src="../assets/codetorchFlame.svg" class="button-center" style="width:70%;">
                                    </button>
                                </a> -->
                            </div>
                        </li>
                        <li>
                            <div class="type-title-sm">Main GD difficulty</div>
                            <p style="font-size: 1.6rem;">{{ level.demonDifficulty }}</p>
                        </li>
                        <li v-if="engiCalc(level) || engiCalc(level) == 0">
                            <div class="type-title-sm">Enjoyment rating</div>
							<p style="font-size: 1.6rem;" v-if="level.name == 'BonesJones Challenge'">fuck no</p>
                            <p style="font-size: 1.6rem;" v-else>{{ engiCalc(level) }}</p>
                        </li>
                    </ul>
                </div>
                    <div v-else-if="selected == null" class="level" style="height: 100%; display: flex; justify-content: center; align-items: center; text-align: center;">
                    <h2>Welcome to the Scratch Geometry Dash Level List!</h2>
                    <p>Click the levels on the left side to see information about them!</p>
                    <p>For more information about the submission rules check the right side!</p>
                    <button class="btn" @click="selected = Math.ceil(Math.random() * list.length)">
                    	<span class="type-label-lg">I'm feeling lucky</span>
					</button>
                    <h2>Filter levels:</h2>
                    <p>Only show levels made in:</p>
					<form action="#" class="type-label-lg">
						<div style="display: flex; align-items: center; gap: 10px;">
                    		<select class="btn" v-model="engineSelected" id="engine" name="engine">
                        		<option class="type-label-lg" value="All" selected>Any Engine</option>
                            	<option class="type-label-lg" value="GDR">GDR</option>
                            	<option class="type-label-lg" value="iPhone">iPhone</option>
                            	<option class="type-label-lg" value="Pig Dash">Pig Dash</option>
                            	<option class="type-label-lg" value="Spooky Dash">Spooky Dash</option>
								<option class="type-label-lg" value="CFB">CFB</option>
								<option class="type-label-lg" value="GDI">GDI</option>
								<option class="type-label-lg" value="GDH">GDH</option>
                        	</select>
					    	<button class="btn" type="submit">Filter!</button>
						</div>
					</form>
                    <a class="nav__icon" href="https://discord.gg/FkKeS9kvT4">
                        <img src="../assets/discord.svg" alt="Discord Logo" style="filter: var(--the-button-on-top)">
                    </a>
                    <p>
                    	<a href="https://discord.gg/FkKeS9kvT4">
                        	join our discord please
                        </a>
                    </p>
					<h2>Changelog</h2>

				<!-- guide bc i suck at css -->
                <!-- you know that you can put multiple lines in this comment,
                right? -->
				<!-- why not 4 different


                                        lines!
 -->
			<!-- add level: <p class="cl">- Added <clw>name</clw> at <clw>#</clw></p> -->
			<!--  <br>- Added <clw>name</clw> at <clw>#</clw> -->
			<!-- move level: <p class="cl">- Moved <clw>name</clw> from <clw>#</clw> to <clw>#</clw></p> -->
			<!--  <br>- Moved <clw>name</clw> from <clw>#</clw> to <clw>#</clw> -->

			<!-- new guide -->

			<!-- add level: <p class="cl">• <clw>name</clw> has been placed at <clw>#</clw>, above <clw>name</clw> and below <clw>name</clw></p> -->
			<!-- raise level: <p class="cl">• <clw>name</clw> has been raised from <clw>#</clw> to <clw>#</clw>, above <clw>name</clw> and below <clw>name</clw></p> -->
			<!-- lower level: <p class="cl">• <clw>name</clw> has been lowered from <clw>#</clw> to <clw>#</clw>, above <clw>name</clw> and below <clw>name</clw></p> -->
			<!-- swap levels: <p class="cl">• <clw>name</clw> and <clw>name</clw> have been swapped, with <clw>name</clw> now sitting above at <clw>#</clw></p> -->
			<!-- delete level: <p class="cl">• <clw>name</clw> have been removed</p> --> 

			<!-- ok -->

                    <main style="display: flex; flex-direction: column; align-items: left; gap: 24px; text-align: left; overflow: hidden; overflow-y: auto; max-height: 300px; width: 700px; border: 3px solid var(--color-primary); border-radius: 5px;">
            			<div style="display: flex; flex-direction: column; align-items: left; gap: 24px; overflow: visible; margin-left: 10px; margin-top: 12px">
                            <ul style="list-style-type: disc; padding-left: 2rem">
								<template v-for="change in changelog">
									<h2 v-if="change.date" style="margin: 1rem; margin-left: -1rem; color: var(--accent);">{{ change.date }}</h2>
                                    <li v-if="change.action == 'a'" class="cl" style="margin: 0;"><clw>{{ change.levelname }}</clw> has been placed at <clw>#{{ change.position }}</clw>, above <clw>{{ change.above }}</clw> and below <clw>{{ change.below }}</clw></li>
									<li v-if="change.action == 's'" class="cl" style="margin: 0;"><clw>{{ change.levelname }}</clw> and <clw>{{ change.swapped }}</clw> have been swapped, with <clw>{{ change.levelname }}</clw> now sitting above at <clw>#{{ change.position }}</clw></li>
									<li v-if="change.action == 'm'" class="cl" style="margin: 0;"><clw>{{ change.levelname }}</clw> has been raised from <clw>#{{ change.oldposition }}</clw> to <clw>#{{ change.position }}</clw>, above <clw>{{ change.above }}</clw> and below <clw>{{ change.below }}</clw></li>
									<li v-if="change.action == 'l'" class="cl" style="margin: 0;"><clw>{{ change.levelname }}</clw> has been lowered from <clw>#{{ change.oldposition }}</clw> to <clw>#{{ change.position }}</clw>, above <clw>{{ change.above }}</clw> and below <clw>{{ change.below }}</clw></li>
									<li v-if="change.action == 'd'" class="cl" style="margin: 0;"><clw>{{ change.levelname }}</clw> has been removed</li>
								</template>
                            </ul>
						</div>
        			</main>
                </div>
            </div>
            <div class="meta-container">
                <div v-if="selected || selected == 0" class="meta">
					<div style="display: flex; align-items: center;">
                    	<h2>Records ({{ level.records.length }})</h2>
						<h2 style="font-size: 1.3rem; color: #808080; margin-left: 0.25rem;"> - {{ level.name }}
					</div>
                    	<p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    	<p v-else-if="selected + 1 <= 150"><strong>100%</strong> or better to qualify</p>
                    	<p v-else>This level does not accept new records.</p>
                    	<p v-if="level.legacy">This level should be beaten with legacy hitboxes</p>
                    	<p v-else-if="level.legacy == false">This level must be beaten using the new hitboxes</p>
                    	<p v-if="level.twoplayer">This level must be beaten solo to qualify</p>
                    <table class="records">
						<tr class="record">
                            <td class="percent">
                                <p style="color: #808080;">verified</p>
                            </td>
                            <td class="user">
                                <a :href="level.verification" target="_blank" class="type-label-lg">{{ level.verifier }}</a>
                            </td>
							<td class="hz">
                                <p style="color: #808080;" v-if="level.enj || level.enj === 0">{{ level.enj }}/100</p>
                            </td>
                            <td class="mobile">
                                <img v-if="level.mobile" style="filter: brightness(0.5);" src="/assets/phone-landscape-dark.svg" width="24" alt="Mobile">
                            </td>
                            <td class="controller">
                                <img v-if="level.controller" style="filter: brightness(0.5);" src="/assets/controller.svg" width="24" alt="Controller">
                            </td>
							<td class="hz">
                                <p v-if="level.hz" style="color: #808080;">{{ level.hz }}Hz</p>
                            </td>
                        </tr>
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p style="color: #808080;">{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
							<td class="hz">
                                <p style="color: #808080;" v-if="record.enj || record.enj === 0">{{ record.enj }}/100</p>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" style="filter: brightness(0.5);" src="/assets/phone-landscape-dark.svg" width="24" alt="Mobile">
                            </td>
                            <td class="controller">
                                <img v-if="record.controller" style="filter: brightness(0.5);" src="/assets/controller.svg" width="24" alt="Controller">
                            </td>
                            <td class="hz">
                                <p style="color: #808080;">{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p style="color: #808080;" class="type-label-md">Website layout made by <a href="https://tsl.pages.dev" style="text-decoration: underline;" target="_blank">TheShittyList</a>. <br> UI inspired by <a href="https://aredl.net" style="text-decoration: underline;" target="_blank">The All Rated Extreme Demons List</a>. <br> Points equation stolen from <a href="https://list-calc.finite-weeb.xyz" style="text-decoration: underline;" target="_blank">this peak website</a> and <a href="https://www.pointercrate.com" style="text-decoration: underline;" target="_blank">Pointercrate</a>.</p>
                    </div>
                    <h2>Submission Requirements</h2>
                    <h3 style="font-weight: 550; font-size: 1.6rem;">
                        Record submission:
                    </h3>
                    <p>
                        - Achieved the record without using hacks (however, Turbowarp's FPS bypass is allowed, up to 250fps for levels that support delta time like Geometry Dash Revamped, Geometry Pig Dash,... and levels use Peneren's Spooky Dash Mods or Peneren's Pig Dash Mods can use hacks that don't affect the cheat indicator except speedhack).
                    </p>
                    <p>
                        - The recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt.
                    </p>
                    <p>
						- The recording must also show the player hit the endwall or reach the empty part at the end of the level, or the completion will be invalidated.
                    </p>
					<p>
						- Completion must use ~30 fps (you can use more than 30 fps for projects that have delta time built into them).
					</p>
					<p>
						- The recording must show the FPS used, or give moderator raw footage of the completion.
					</p>
                    <p>
                        - Do not use secret routes or bug routes.
                    </p>
                    <p>
                        - Do not use easy modes, only a record of the unmodified gameplay qualifies (depends on what level it is).
                    </p>
                    <p>
                    	- For harder levels, repeatably not having raw footage/clicks could impact your levels/records getting added.
If you accidentally show information in your completion you do not want shown, you can also show yourself getting far on the level with clicks/raw footage.
It is recommended to upload your raw footage as a file.
                    </p>
                    <p>
                        - Once a level falls onto the Legacy List, we accept records for it for 24 hours after it falls off, then afterwards we never accept records for said level.
                    </p>
                    <h3 style="font-weight: 550; font-size: 1.6rem;">
                        Level requirement:
                    </h3>
                    <p>
                        - A level must be 20 seconds or longer and it must have decent quality of gameplay.
                    </p>
                    <p>
                        - A level must have some effort put into it.
                    </p>
                    <p>
                        - A level that has spam as main difficulty is not eligible to add.
                    </p>
                </div>
            </div>
			
            <!-- <img v-if="level.name" :src="getThumbnailImage(level.name)" style="position: absolute; left: 0px; top: 0px; z-index: -1; object-fit: cover; width: 100%; height: 100%; filter: brightness(50%);">
            <img v-else src="../assets/white.webp" style="position: absolute; left: 0px; top: 0px; z-index: -1; object-fit: cover; width: 100%; height: 100%; filter: brightness(10%);"> -->
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: null,
        engineAsked: getEngineSelect(),
        params: new URLSearchParams(document.location.search),
        tagsj: JSON.parse("[" + new URLSearchParams(document.location.search).get("tags") + "]"),
        engineSelected: "All",
		grat: "../assets/levels/",
        fileFormat: "h",
        sdhfkjsdbhfkjs: "assets/levels/B R A I N S P A C E.png",
        levelSearch: null,
        searchQuery: '',
        ii: 0,
        blt: 0,
        errors: [],
        roleIconMap,
        store,
    }),
    computed: {
        getDemonDifficulty() {
            if (this.selected == null) {
            	return 0;
            } else {
                if (this.list[this.selected][0].demonDifficulty == "Iraq Demon") {
                    this.fileFormat = '.svg';
                } else {
                    this.fileFormat = '.png';
                }
                if (this.list[this.selected][0].demonDifficulty == "PETA Demon") {
                    return "https://www.peta.org/wp-content/themes/peta/src/assets/images/svgs/peta-logo.svg";
                } else if (this.list[this.selected][0].demonDifficulty == "Poopy Demon") {
                    return "https://raw.githubusercontent.com/twitter/twemoji/a6f943b958d94b2b82f886aa540b915d9a694a75/assets/svg/1f4a9.svg";
                } else if (this.list[this.selected][0].demonDifficulty == "love Demon") {
                    return "https://upload.wikimedia.org/wikipedia/commons/c/c8/Twemoji15.0.2_1fa77.svg";
                } else if (this.list[this.selected][0].demonDifficulty == "Top 14 Very Hard Timing Map Very Demon") {
                    return "https://media.tenor.com/ejuK2N9toPMAAAAe/gd-geometry-dash.png";
                } else if (this.list[this.selected][0].name == "Lucid Dreaming") {
                    return "https://upload.wikimedia.org/wikipedia/commons/7/72/Twemoji_1f634.svg";
                }
                // Playstation Vita credit: https://image.ceneostatic.pl/data/products/13107195/i-sony-playstation-vita-wifi.jpg can we even use this legally idk don't sue
                return encodeURI(`assets/difficulties/${this.list[this.selected][0].demonDifficulty}${this.fileFormat}`);
            }
        },
        level() {
            if (this.selected == null) {
            	return 0;
            } else {
                return this.list[this.selected][0];
            }
        },
        originalListWithIndex() {
            return (this.list || []).map(([level, err], index) => ({
                level,
                err,
                originalIndex: index,
            }));
        },
        filteredListDisplay() {
            if (!this.searchQuery.trim()) {
                return this.originalListWithIndex;
            }
            const searchTerm = this.searchQuery.toLowerCase();
            console.warn((this.originalListWithIndex || []).filter(item => item.level?.name?.toLowerCase().includes(searchTerm.toLowerCase())));
            return (this.originalListWithIndex || []).filter(item => item.level?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
		},
		originalPacksWithIndex() {
            console.error(this.packs);
            return this.packs;
        },
        video() {
				console.warn("! Level Names:");
				for (let i = 0; i < this.list.length; i++) {
                    console.warn(this.list[i][0].name);
                }
				console.warn("! Level Info:");
				for (let i = 0; i < this.list.length; i++) {
                    console.warn(this.list[i][0].name + "⓪" + this.list[i][0].verifier + "⓪" + this.list[i][0].author + "⓪" + this.list[i][0].engine + "⓪");
                }
				console.warn("! Level URL's:");
                for (let i = 0; i < this.list.length; i++) {
                    console.warn(this.list[i][0].id + "⓪" + this.list[i][0].itchLink + "⓪" + this.list[i][0].itchLink2 + "⓪");
                }
				console.warn("! Level Videos:");
                for (let i = 0; i < this.list.length; i++) {
                    console.warn(getYoutubeIdFromUrl(this.list[i][0].verification));
                }
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }
            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    watch: {
        filteredListDisplay: {
            handler(newList) {
                if (newList.length > 0) {
                    const currentSelectionInNewList = newList.find(item => item.originalIndex === this.selected);
                    if (!currentSelectionInNewList) {
                        this.selected = newList[0].originalIndex;
                    }
                } else {
                    this.selected = null;
                }
            },
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();
        this.changelog = await fetchChangelog();
		this.packs = await fetchPacks();
        this.tags = await fetchTags();
        this.selected = await getSelectSelect(this.list);
		let params = new URLSearchParams(document.location.search); 
        if (params.get("filter") == "enjoyment") {
            this.list.sort((a, b) => (engiCalc(b[0]) || -999) - (engiCalc(a[0]) || -999));   
        }
        if (params.get("filter") == "alphabetically") {
            this.list.sort(function (a, b) {
            if (a[0].name.toLowerCase() < b[0].name.toLowerCase()) {
                return -1;
            }
            if (a[0].name.toLowerCase() > b[0].name.toLowerCase()) {
                return 1;
            }
            return 0;
            }); 
        }
        if (params.get("tags")) {
            const tagsj = JSON.parse("[" + params.get("tags") + "]");
            console.error(params.get("tags"));
            console.error(tagsj);
			console.error(this.list);
			console.error("fortnite))");
			this.list = this.list.filter(item => item[0].tags?.includes(tagsj[0]));
			console.error(this.list);
        }
        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }
        this.loading = false;
    },
    methods: {
        embed,
        score,
        getLevelThumbnail,
        getThumbnailImage,
        listLevelNameFilter,
        engiCalc,
    },
};
