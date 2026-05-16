import { store } from "../main.js";
import { localize } from '../util.js';
import { fetchEditors, fetchDidYouKnow, fetchChangelog } from "../content.js";
import Spinner from '../components/Spinner.js';

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: {
        Spinner,
    },
    data: () => ({
        loading: true,
        editors: [],
        roleIconMap,
        store,
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main class="home" v-else>
        <div class="list-info">
            <div class="list-info60">
                <div>
                    <h1>Welcome to the SGD Level List!</h1>
                    <h2>Home of the better SGD List</h2>
                    <h3>The SGD Levels List is home to like some list stuff yea idk</h3>
                    <button style="width: 12em; margin-bottom: 1em;" class="btn" onclick="window.open('/list', '_self')">Check it out!</button>
                </div>
                <div>
                    <div class="discord-plug">
                        <h2>We also have the most active SGD Discord server!</h2>
                        <button style="width: 12em; margin-bottom: 1em; justify-self: center;" class="btn" onclick="window.open('https://discord.gg/FkKeS9kvT4', '_self')">Check it out!</button>
                        <iframe style="justify-self: center;" src="https://discord.com/widget?id=1441949351470567487&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                    </div>
                </div>
				<div>
                    <div class="discord-plug">
                        <h2>Changelog</h2>
                        <main style="display: flex; flex-direction: column; align-items: left; gap: 24px; text-align: left; overflow: hidden; overflow-y: auto; height: 300px; width: 700px; border: 3px solid var(--color-primary); border-radius: 5px; margin-bottom: 4em;">
            			<div style="display: flex; flex-direction: column; align-items: left; gap: 24px; overflow: visible; margin-left: 10px; margin-top: 12px">
                            <ul style="list-style-type: disc; padding-left: 2rem; text-align: left;">
								<template v-for="change in changelog">
									<h2 v-if="change.date" style="margin: 1rem; margin-left: -1rem; color: #ffbe00;">{{ change.date }}</h2>
                                    <li v-if="change.action == 'a'" class="cl" style="margin: 0;"><clw>{{ change.levelname }}</clw> has been placed at <clw>#{{ change.position }}</clw>, above <clw>{{ change.above }}</clw> and below <clw>{{ change.below }}</clw></li>
									<li v-if="change.action == 's'" class="cl" style="margin: 0;"><clw>{{ change.levelname }}</clw> and <clw>{{ change.swapped }}</clw> have been swapped, with <clw>{{ change.levelname }}</clw> now sitting above at <clw>#{{ change.position }}</clw></li>
									<li v-if="change.action == 'm'" class="cl" style="margin: 0;"><clw>{{ change.levelname }}</clw> has been raised from <clw>#{{ change.oldposition }}</clw> to <clw>#{{ change.position }}</clw>, above <clw>{{ change.above }}</clw> and below <clw>{{ change.below }}</clw></li>
									<li v-if="change.action == 'l'" class="cl" style="margin: 0;"><clw>{{ change.levelname }}</clw> has been lowered from <clw>#{{ change.oldposition }}</clw> to <clw>#{{ change.position }}</clw>, above <clw>{{ change.above }}</clw> and below <clw>{{ change.below }}</clw></li>
									<li v-if="change.action == 'd'" class="cl" style="margin: 0;"><clw>{{ change.levelname }}</clw> has been removed</li>
								</template>
                            </ul>
                        </template>
						</div>
        			</main>
                    </div>
                </div>
            </div>
            <div class="moderator-info">
                <div class="moderator-container">
						<h2>List Moderators</h2>
                            <ol class="editors editors-display">
								<h3>Owners</h3>
      							<div class="editor-container">
									<div v-for="editor in editors.filter(son => son.role === 'owner')" class="motorcycle">
										<div style="display: flex; gap: 8px;">
											<img style="height: 20px; align-self: center; filter: brightness(0.5);" :src="\`/assets/\${roleIconMap[editor.role]}-dark.svg\`" :alt="editor.role">
                                    		<a v-if="editor.name" style="align-content: center; font-size: 1rem;" :href="\`https://scratch.mit.edu/users/\${editor.name}\`" class="type-label-lg link" target="_blank">{{ editor.name }}</a>
										</div>
                                    	<div class="button-holder">
                                        <!-- money folder -->
                                        	<a v-if="editor.ytHandle != null" :href="\`https://www.youtube.com/@\${editor.ytHandle}\`" target="_blank">
                                            	<img v-if="editor.name == 'Wallyboom2010'" src="../assets/youtube.svg" class="button-center" style="filter: brightness(0.5); height: 15px;">
                                            	<img v-else src="../assets/youtube.svg" class="button-center" style="filter: brightness(0.5); height: 20px;">
                                        	</a>
                                        	<a v-if="editor.discordId != null" :href="\`https://discord.com/users/\${editor.discordId}\`" target="_blank">
                                            	<img v-if="editor.name == 'Wallyboom2010'" src="../assets/discord.svg" class="button-center" style="filter: brightness(0.5); height: 15px;">
                                            	<img v-else src="../assets/discord.svg" class="button-center" style="filter: brightness(0.5); height: 20px;">
                                        	</a>  
										</div>
                                    </div>
								</div>
								<h3>Moderators</h3>
      							<div class="editor-container">
									<div v-for="editor in editors.filter(son => son.role === 'helper')" class="motorcycle">
										<div style="display: flex; gap: 8px;">
											<img style="height: 17px; align-self: center; filter: brightness(0.5);" :src="\`/assets/\${roleIconMap[editor.role]}-dark.svg\`" :alt="editor.role">
                                    		<a v-if="editor.name" style="align-content: center; font-size: 1rem;" :href="\`https://scratch.mit.edu/users/\${editor.name}\`" class="type-label-lg link" target="_blank">{{ editor.name }}</a>
										</div>
                                    	<div class="button-holder">
                                        <!-- money folder -->
                                        	<a v-if="editor.ytHandle != null" :href="\`https://www.youtube.com/@\${editor.ytHandle}\`" target="_blank">
                                            	<img v-if="editor.name == 'Wallyboom2010'" src="../assets/youtube.svg" class="button-center" style="filter: brightness(0.5); height: 15px;">
                                            	<img v-else src="../assets/youtube.svg" class="button-center" style="filter: brightness(0.5); height: 20px;">
                                        	</a>
                                        	<a v-if="editor.discordId != null" :href="\`https://discord.com/users/\${editor.discordId}\`" target="_blank">
                                            	<img v-if="editor.name == 'Wallyboom2010'" src="../assets/discord.svg" class="button-center" style="filter: brightness(0.5); height: 15px;">
                                            	<img v-else src="../assets/discord.svg" class="button-center" style="filter: brightness(0.5); height: 20px;">
                                        	</a>  
										</div>
                                    </div>
								</div>
								<h3>Developers</h3>
      							<div class="editor-container">
									<div v-for="editor in editors.filter(son => son.role === 'dev')" class="motorcycle">
										<div style="display: flex; gap: 8px;">
											<img style="height: 17px; align-self: center; filter: brightness(0.5);" :src="\`/assets/\${roleIconMap[editor.role]}-dark.svg\`" :alt="editor.role">
                                    		<a v-if="editor.name" style="align-content: center; font-size: 1rem;" :href="\`https://scratch.mit.edu/users/\${editor.name}\`" class="type-label-lg link" target="_blank">{{ editor.name }}</a>
										</div>
                                    	<div class="button-holder">
                                        <!-- money folder -->
                                        	<a v-if="editor.ytHandle != null" :href="\`https://www.youtube.com/@\${editor.ytHandle}\`" target="_blank">
                                            	<img v-if="editor.name == 'Wallyboom2010'" src="../assets/youtube.svg" class="button-center" style="filter: brightness(0.5); height: 15px;">
                                            	<img v-else src="../assets/youtube.svg" class="button-center" style="filter: brightness(0.5); height: 20px;">
                                        	</a>
                                        	<a v-if="editor.discordId != null" :href="\`https://discord.com/users/\${editor.discordId}\`" target="_blank">
                                            	<img v-if="editor.name == 'Wallyboom2010'" src="../assets/discord.svg" class="button-center" style="filter: brightness(0.5); height: 15px;">
                                            	<img v-else src="../assets/discord.svg" class="button-center" style="filter: brightness(0.5); height: 20px;">
                                        	</a>  
										</div>
                                    </div>
								</div>
                            </ol>
                     </div>
                     <div>  
                     <div style="display: flex; flex-direction: column; gap: 1rem;">
					 	<h3><b>Did you know?</b></h3>
					 	<h3 style="margin-right: 4em;" v-if="this.didYouKnow && this.didYouKnow.length" v-html="this.didYouKnow[Math.floor(Math.random() * this.didYouKnow.length)]"></h3>
                     </div>
                </div>
            </div>
		</main>
    `,
    async mounted() {
        this.editors = await fetchEditors();
        this.didYouKnow = await fetchDidYouKnow();
		this.changelog = await fetchChangelog();
        // Hide loading spinner
        this.loading = false;
    },
    methods: {
        localize,
    },
};
