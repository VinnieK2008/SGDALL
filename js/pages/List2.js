import { store } from "../main.js";
import { embed, getEngineSelect, getSelectSelect, doStuff, getThumbnailImage, incVisits, getYoutubeIdFromUrl, getLevelThumbnail, listLevelNameFilter } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList, fetchPacks } from "../content.js";

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
        <main v-if="loading" :style="level?.name ? { background: 'var(--color-background-list)' } : {}">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list" :style="level?.name ? { background: 'var(--color-background-list)' } : {}">
            <div class="list-container">
				<div style="display: grid;">
					<input v-model="searchQuery" placeholder="Input text to Filter! here..." class="btn" type="text" id="filterForLevelName"/>
				</div>
                <table class="list" v-if="list && list.length">
                    <tr v-for="(item, i) in filteredListDisplay" :key="item.originalIndex">
                        <template v-if="engineAsked == null">
                            <td class="rank">
                                <p v-if="item.originalIndex + 1 <= 150" class="type-label-lg">#{{ item.originalIndex + 1 }}</p>
                                <p v-else class="type-label-lg">Legacy</p>
                            </td>
                            <td class="level" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }">
                                <button id="levelThumbnailReal" @click="selected = item.originalIndex" style="background-color: rgb(255 0 0 / 0); width: 90%; margin: 0.5em;" :style="getLevelThumbnail(item.originalIndex, list)" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }">
                                    <span class="type-label-lg">{{ item.level?.name || \`Error (\${item.err}.json)\` }}</span>
                                    <span class="type-label-sm">Verified by {{ item.level.verifier }}</span>
                                </button>
                            </td>
                         </template>
                        <template v-else-if="engineAsked == item.level.engine">
                            <td class="rank">
                                <p v-if="item.originalIndex + 1 <= 150" class="type-label-lg">#{{ item.originalIndex + 1 }}</p>
                                <p v-else class="type-label-lg">Legacy</p>
                            </td>
                            <td class="level" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }">
                                <button id="levelThumbnailReal" @click="selected = item.originalIndex" style="background-color: rgb(255 0 0 / 0); width: 90%; margin: 0.5em;" :style="getLevelThumbnail(item.originalIndex, list)" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }">
                                    <span class="type-label-lg">{{ item.level?.name || \`Error (\${item.err}.json)\` }}</span>
                                    <span class="type-label-sm">Verified by {{ item.level.verifier }}</span>
                                    <!-- oh okay -->
                                </button>
                            </td>
                        </template>
                    </tr>
                </table>
                <a style="display: flex; justify-content: center;" href="https://scratch.mit.edu/projects/1285018326/" target="_blank">
            		<img src="../assets/ads/ad1.png" style="height: 7rem">
            	</a>
                <p v-if="list && list.length > 0 && filteredListDisplay && filteredListDisplay.length === 0" class="type-body-lg">
					<br>
                    No levels found matching your search.
                </p>
            </div>
            <div class="level-container">
			<a style="display: flex; justify-content: center;" href="https://scratch.mit.edu/projects/1285018326/" target="_blank">
            	<img src="../assets/ads/ad1.png" style="height: 7rem">
            </a>
			<a v-if="level" @click="selected = null">
            	<img src="../assets/back.svg" style="filter: var(--the-button-on-top); width: 12px">
            </a>
                <div class="level" v-if="level">
					<div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; justify-self: center;">
                    <div class="button-holder" style="gap: 1em; ">
                        <img :src="getDemonDifficulty" height="32">
                        <h1>{{ level.name }}</h1>
                    </div>
                    <h1 style="border-bottom: 1px solid #808080;padding-bottom: 8px;"></h1>
					<p class="desc" v-if="level.description" v-html="level.description"></p>
					</div>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier" :engine="level.engine"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0" allowfullscreen scrolling="no" allow="encrypted-media *; fullscreen *;" style="border-radius: 1rem;"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div v-if="level.scratchLink != null" class="type-title-sm">Links</div>
                            <div v-else-if="level.itchLink2 != null" class="type-title-sm">Links</div>
                            <div v-else class="type-title-sm">Link</div>
                            <div class="button-holder">
                            <!-- money folder -->
								<a v-if="level.id != null" :href="\`https://scratch.mit.edu/projects/\${level.id}\`" target="_blank">
                                	<button class="link-button" style="background-color: #f7a935; border-color: #f7a935;">
										<img src="../assets/scratchS.svg" class="button-center" style="width:70%;">
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
                                    <button class="link-button" style="background-color: #7d2e2e; border-color: #7d2e2e;">
                                        <img src="../assets/codetorchFlame.svg" class="button-center" style="width:100%;">
                                    </button>
                                </a>     
                            </div>
                        </li>
                        <li>
                            <div class="type-title-sm">Main GD difficulty</div>
                            <p>{{ level.demonDifficulty }}</p>
                        </li>
                    </ul>
					<a style="display: flex; justify-content: center;" href="https://scratch.mit.edu/projects/1285018326/" target="_blank">
            			<img src="../assets/ads/ad1.png" style="height: 7rem">
            		</a>
                    <h2>Records ({{ level.records.length }})</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected + 1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <p v-if="level.legacy">This level should be beaten with legacy hitboxes</p>
                    <p v-else-if="level.legacy == false">This level must be beaten using the new hitboxes</p>
                    <p v-if="level.twoplayer">This level must be beaten solo to qualify</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="controller">
                                <img v-if="record.controller" src="/assets/controller.svg" width="24" alt="Controller">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
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

			<!-- add level: <p class="cl">- <clw>name</clw> has been placed at <clw>#</clw>, above <clw>name</clw> and below <clw>name</clw></p> -->
			<!-- raise level: <p class="cl">- <clw>name</clw> has been raised from <clw>#</clw> to <clw>#</clw>, above <clw>name</clw> and below <clw>name</clw></p> -->
			<!-- lower level: <p class="cl">- <clw>name</clw> has been lowered from <clw>#</clw> to <clw>#</clw>, above <clw>name</clw> and below <clw>name</clw></p> -->
			<!-- swap levels: <p class="cl">- <clw>name</clw> and <clw>name</clw> have been swapped, with <clw>name</clw> now sitting above at <clw>#</clw></p> -->
			<!-- delete level: <p class="cl">- <clw>name</clw> have been removed</p> --> 

			<!-- ok -->

                    <main style="display: flex; flex-direction: column; align-items: left; gap: 24px; text-align: left; overflow: hidden; overflow-y: auto; max-height: 300px; width: 700px; border: 3px solid var(--color-primary); border-radius: 5px;">
            			<div style="display: flex; flex-direction: column; align-items: left; gap: 24px; overflow: visible; margin-left: 10px; margin-top: 12px">
							<h2>23-Mar-2026</h2>
							<p class="cl">- <clw>Nullify</clw> has been placed at <clw>#63</clw>, above <clw>Infinite Cosmos</clw> and below <clw>Idiot Corridor</clw></p>
							<p class="cl">- <clw>Pigs do buff</clw> has been raised from <clw>#56</clw> to <clw>#54</clw>, above <clw>Mayham X</clw> and below <clw>B R A I N S P A C E</clw></p>
							<h2>22-Mar-2026</h2>
							<p class="cl">- <clw>The World Destroyer Rebirth</clw> has been placed at <clw>#58</clw>, above <clw>BROKEN_CITYSCAPE</clw> and below <clw>Teto Territory</clw></p>
							<h2>21-Mar-2026</h2>
							<p class="cl">- <clw>Peneren Hard Map V</clw> and <clw>Styx</clw> have been swapped, with <clw>Peneren Hard Map V</clw> now sitting above at <clw>#6</clw></p>
							<a style="display: flex; justify-content: center;" href="https://scratch.mit.edu/projects/1285018326/" target="_blank">
            					<img src="../assets/ads/ad1.png" style="height: 7rem">
           					</a>
							<h2>20-Mar-2026</h2>
							<p class="cl">- <clw>Stairs Of Fate</clw> has been placed at <clw>#65</clw>, above <clw>Shattered Cityscape</clw> and below <clw>Midnight Circles</clw></p>
							<p class="cl">- <clw>Amidst The Misery</clw> has been raised from <clw>#21</clw> to <clw>#19</clw>, above <clw>Peneren Hard Map III</clw> and below <clw>NO WAY</clw></p>
							<p class="cl">- <clw>Styx</clw> and <clw>Peneren Hard Map V</clw> have been swapped, with <clw>Styx</clw> now sitting above at <clw>#6</clw></p>
							<h2>19-Mar-2026</h2>
							<p class="cl">- <clw>Phoenix A</clw> and <clw>Peneren Hard Map V</clw> have been swapped, with <clw>Phoenix A</clw> now sitting above at <clw>#5</clw></p>
							<h2>18-Mar-2026</h2>
							<p class="cl">- <clw>Triangle Force</clw> has been placed at <clw>#36</clw>, above <clw>Sweet Escape</clw> and below <clw>Delima De Duelo</clw> <br>- <clw>Pigs do buff</clw> has been placed at <clw>#56</clw>, above <clw>Teto Territory</clw> and below <clw>Buffwartz</clw></p>
							<h2>17-Mar-2026</h2>
							<p class="cl">- <clw>Sweet Escape</clw> has been placed at <clw>#36</clw>, above <clw>Every End</clw> and below <clw>Delima De Duelo</clw></p>
							<small style="color: #808080; margin-left: 10px;">new format!</small>
							<h2>14-Mar-2026</h2>
							<p class="cl">- Removed <clw>the former top 10 levels</clw> due to <clw>lacking enough evidence</clw></p>
							<h2>08-Mar-2026</h2>
							<p class="cl">- Added <clw>Penumbra Phantasm</clw> at <clw>#48</clw></p>
							<h2>02-Mar-2026</h2>
							<p class="cl">- Added <clw>WallyBoom Challenge</clw> at <clw>#17</clw></p>
							<h2>27-Feb-2026</h2>
							<p class="cl">- Added <clw>Iraqophobia</clw> at <clw>#15</clw> <br>- Added <clw>BonesJones Challenge</clw> at <clw>#16</clw> <br>- Moved <clw>Iraqophobia</clw> from <clw>#15</clw> to <clw>#9</clw></p>
							<h2>25-Feb-2026</h2>
							<p class="cl">- Added <clw>Eternal Rest</clw> at <clw>#2</clw></p>
                            <h2>24-Feb-2026</h2>
                            <p class="cl">- Moved <clw>Blue Blizzard</clw> from <clw>#26</clw> to <clw>#34</clw> <br>- Moved <clw>California girls</clw> from <clw>#32</clw> to <clw>#25</clw> <br>- Moved <clw>Tidal Square Rebirth</clw> from <clw>#22</clw> to <clw>#27</clw> <br>- Moved <clw>Interstellar</clw> from <clw>#28</clw> to <clw>#29</clw> <br>- Moved <clw>Neptune</clw> from <clw>#29</clw> to <clw>#30</clw> <br>- Moved <clw>GIVEUP!AKIRAMERU!</clw> from <clw>#17</clw> to <clw>#26</clw></p>
                			<h2>23-Feb-2026</h2>
                			<p class="cl">- Added <clw>high noon</clw> at <clw>#21</clw> <br>- Added <clw>Tidal Square Rebirth</clw> at <clw>#22</clw></p>
                			<h2>22-Feb-2026</h2>
                			<p class="cl">- Added <clw>Thermodynamix</clw> at <clw>#11</clw> <br>- Moved <clw>Phoenix A</clw> from <clw>#16</clw> to <clw>#10</clw> <br>- Moved <clw>Over The Edge</clw> from <clw>#12</clw> to <clw>#16</clw></p>
                			<h2>21-Feb-2026</h2>
                			<p class="cl">- Added <clw>NO WAY</clw> at <clw>#18</clw></p>
                			<h2>01-Feb-2026</h2>
                			<p class="cl">- Added <clw>Over The Edge</clw> at <clw>#11</clw></p>
                			<h2>06-Jan-2026</h2>
                			<p class="cl">- Added <clw>Interstellar</clw> at <clw>#25</clw> <br>- Moved <clw>Pigbuff</clw> from <clw>#18</clw> to <clw>#40</clw> <br>- Moved <clw>Operation: Evolution</clw> from <clw>#16</clw> to <clw>#28</clw> <br>- Moved <clw>Idiot Corridor</clw> from <clw>#34</clw> to <clw>#51</clw> <br>- Moved <clw>CORRUPT3D_N3BULA</clw> from <clw>#30</clw> to <clw>#39</clw> <br>- Moved <clw>During Depression</clw> from <clw>#31</clw> to <clw>#38</clw></p>
                			<h2>04-Jan-2026</h2>
                			<p class="cl">- Added <clw>hammer of justice</clw> at <clw>#40</clw></p>
                			<h2>03-Jan-2026</h2>
                			<p class="cl">- Added <clw>Greyhound</clw> at <clw>#1</clw> <br>- Added <clw>Purple Storm</clw> at <clw>#2</clw> <br>- Added <clw>Triangle Of Time</clw> at <clw>#3</clw></p>
                			<h2>02-Jan-2026</h2>
                			<p class="cl">- Added <clw>Kibo</clw> at <clw>#5</clw> <br>- Added <clw>California girls</clw> at <clw>#35</clw> <br>- Moved <clw>California girls</clw> from <clw>#35</clw> to <clw>#27</clw> <br>- Moved <clw>Holography</clw> from <clw>#23</clw> to <clw>#39</clw> <br>- Moved <clw>Peneren Hard Map I</clw> from <clw>#22</clw> to <clw>#37</clw> <br>- Moved <clw>Infinite Cosmos</clw> from <clw>#41</clw> to <clw>#47</clw></p>
                			<br>
                			<p>For changes before 2026 visit the <a href="https://docs.google.com/document/d/1ICK2Rl7NpCYRQnr04lZGeGViZ1mR5sw3C4cuQ19Nm0I" target="_blank" style="text-decoration: underline;">old changelog</a>!</p>
						</div>
        			</main>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev" style="text-decoration: underline;" target="_blank">TheShittyList</a>. <br> UI inspired by <a href="https://aredl.net" style="text-decoration: underline;" target="_blank">The All Rated Extreme Demons List</a>. <br> Points equation stolen from <a href="https://list-calc.finite-weeb.xyz" style="text-decoration: underline;" target="_blank">this peak website</a> and <a href="https://www.pointercrate.com" style="text-decoration: underline;" target="_blank">Pointercrate</a>.</p>
                    </div>
                    <template v-if="editors">
                        <h2>List Moderators</h2>
                        <ol class="editors">
                            <li v-for="editor in editors" style="height: 20px;">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.name" class="type-label-lg link" target="_blank">{{ editor.name }}</a>
								<br>
                                <div class="button-holder">
                                    <!-- money folder -->
                                    <a v-if="editor.name != null" :href="\`https://scratch.mit.edu/users/\${editor.name}\`" target="_blank">
                                        <img v-if="editor.name == 'Wallyboom2010'" src="../assets/scratchS.svg" height="40" class="button-center" style="height: 20px;">
										<img v-else src="../assets/scratchS.svg" height="40" class="button-center" style="height: 30px;">
                                    </a>
                                    <a v-if="editor.ytHandle != null" :href="\`https://www.youtube.com/@\${editor.ytHandle}\`" target="_blank">
                                        <img v-if="editor.name == 'Wallyboom2010'" src="../assets/youtube.svg" height="40" class="button-center" style="filter: var(--the-button-on-top); height: 20px;">
										<img v-else src="../assets/youtube.svg" height="40" class="button-center" style="filter: var(--the-button-on-top); height: 30px;">
                                    </a>
                                    <a v-if="editor.discordId != null" :href="\`https://discord.com/users/\${editor.discordId}\`" target="_blank">
                                        <img v-if="editor.name == 'Wallyboom2010'" src="../assets/discord.svg" height="40" class="button-center" style="filter: var(--the-button-on-top); height: 20px;">
										<img v-else src="../assets/discord.svg" height="40" class="button-center" style="filter: var(--the-button-on-top); height: 30px;">
                                    </a>                         
                                </div>
                            </li>
                        </ol>
                    </template>
                    <h2>Submission Requirements</h2>
                    <h3 style="font-weight: 550;">
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
					<a style="display: flex; justify-content: center;" href="https://scratch.mit.edu/projects/1285018326/" target="_blank">
            			<img src="../assets/ads/ad1.png" style="height: 7rem">
           			 </a>
                    <h3 style="font-weight: 550;">
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
            <img v-if="level.name" :src="getThumbnailImage(level.name)" style="position: absolute; left: 0px; top: 0px; z-index: -1; object-fit: cover; width: 100%; height: 100%; filter: brightness(50%);">
            <img v-else src="../assets/white.webp" style="position: absolute; left: 0px; top: 0px; z-index: -1; object-fit: cover; width: 100%; height: 100%; filter: brightness(10%);">
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: null,
        engineAsked: getEngineSelect(),
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
            if (!this.level.showcase) {
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
		this.packs = await fetchPacks();
        this.selected = await getSelectSelect(this.list);

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
    },
};
