import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';
import { fetchEditors, fetchList, fetchPacks } from "../content.js";
import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else style="display: flex; flex-direction: column; align-items: left; gap: 24px; text-align: left; overflow: hidden; overflow-y: auto;">
		<p> </p>
			<div style="display: flex; flex-direction: column; align-items: left; gap: 24px; margin-left: 100px; overflow: visible;">
				<h1>h1 and also 3 more thing</h1><br><h1>Guideless Goobering</h1>
				<h2>h2 yeah         Records (6)</h2>
                <h3>h3<br>We highly recommend you read the full guidelines here, but these are the main things you need to know.</h3>
                <h4>h4</h4>
                <h5>h5</h5>
				<h6>h6</h6>
                <label>label</label>
				<input type="text">input type text</input>
				<input type="number">input type number</input>
				<body>body</body>
				<p class="type-label-lg-big"> type-label-lg-big</p>
				<p class="type-label-lg-red">type-label-lg-red</p>
				<iframe src="https://drive.google.com/file/d/1VGKQbFlPwkyXFRJ7n9HwIBXByaefnjNY/preview" width="640" height="480"></iframe>
                <p class="type-label-md">type-label-md woah is that comps atm record wow</p>
                <p class="type-label-sm">type-label-sm</p>
				<p>Colorful rainbow memory level acting as the finale in Enfur's unnamed memory trilogy. Features lots of bright and cluttered decoration and unique effects. Memorable for its tricky misaligned dual at 77%</p>
				<p>{{ pack }}</p>
				<p>For changes before 2026 visit the <a href="https://docs.google.com/document/d/1ICK2Rl7NpCYRQnr04lZGeGViZ1mR5sw3C4cuQ19Nm0I" target="_blank" style="text-decoration: underline;">old changelog</a>!</p>
		</main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected]
        },
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
		this.packs = await fetchPacks();
        this.err = err;
        // Hide loading spinner
        this.loading = false;
    },
    methods: {
        localize,
    },
};
