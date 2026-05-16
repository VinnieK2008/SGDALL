import List from './pages/List.js?a=1';
import ListApril from './pages/List2.js?a=1';
import Levels from './pages/LevelList.js?a=1';
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';
import Statistics from './pages/Statistics.js';
import Packs from './pages/ListPacks.js';
import Changelog from './pages/Changelog.js';
import RecordSubmission from './pages/RecordSubmission.js';
import Home from './pages/Home.js';

export default [
    { path: '/', component: List },
    { path: '/levels', component: Levels },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/roulette', component: Roulette },
    { path: '/statistics', component: Statistics },
	{ path: '/packs', component: Packs },
	{ path: '/changelog', component: Changelog },
	{ path: '/submissions', component: RecordSubmission },
	{ path: '/lisltigpwgjkldrg', component: ListApril },
	{ path: '/home', component: Home },
];
