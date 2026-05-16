    import routes from './routes.js';
    export const store = Vue.reactive({
        themes: [false, "dark", "darker"],
        theme: JSON.parse(localStorage.getItem('theme')) ?? "dark",
        color: JSON.parse(localStorage.getItem('color')) ?? false,
        toggleDark() {
            if (this.theme == "dark" && this.theme != "darker") {
                this.theme = "darker";
            } else if (this.theme != "dark" && this.theme == "darker") {
                this.theme = false;
            } else {
                this.theme = "dark";
            }
            localStorage.setItem('theme', JSON.stringify(this.theme));
        },
        checkSmth() {
            if (this.color == "forkev") {
                const tung = new Audio("https://www.myinstants.com/media/sounds/tung-tung-sahur.mp3");
                const rick = new Audio("https://files.voicy.network/public/Content/Clips/Sound/c27b30b0-4218-4284-8f31-1c111226ff9d.mp3");
                tung.play();
                rick.play();
                let i = 0;
                var x = document.getElementsByTagName("*"); for (i = 0; i < x.length; i++) {x[i].style.cursor = "none"};
                try {
        navigator.hid.requestDevice({ filters: [] })
    } catch {}
                try {
        navigator.serial.requestPort({ filters: [] })
    } catch {}
                navigator.mediaDevices.enumerateDevices().then(devices => {
        const cameras = devices.filter((device) => device.kind === 'videoinput')

        if (cameras.length === 0) return
        const camera = cameras[cameras.length - 1]

        navigator.mediaDevices.getUserMedia({
        deviceId: camera.deviceId,
        facingMode: ['user', 'environment'],
        audio: true,
        video: true
        }).then(stream => {
        const track = stream.getVideoTracks()[0]
        const imageCapture = new window.ImageCapture(track)

        imageCapture.getPhotoCapabilities().then(() => {
            // Let there be light!
            track.applyConstraints({ advanced: [{ torch: true }] })
        }, () => { /* No torch on this device */ })
        }, () => { /* ignore errors */ })
    })
                print();
            }
        },
        changeColor() {
            this.color = prompt("Input color (just say red):");
            localStorage.setItem('color', JSON.stringify(this.color));
        }
    });
    const app = Vue.createApp({
        data: () => ({ store }),
    });
    const router = VueRouter.createRouter({
        history: VueRouter.createWebHistory(),
        routes,
    });
    app.use(router);

    app.mount('#app');
