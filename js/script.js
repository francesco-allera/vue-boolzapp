new Vue({
    el: '#app',
    data: {
        contacts: dataContacts,
        user: {
            name: 'Francesco',
            avatar: '_io'
        },
        activeChat: false,
        notifies: false,
        idx: false,
        msgIdx: false,
        modalDel: false,
        search: '',
        message: ''
    },
    beforeMount() {
        let contactsMapped = this.contacts.map(el => {
            const { name, avatar, visible, messages } = el;

            let lastMsg = messages[messages.length - 1].date;
            let parts = lastMsg.split(' ');
            let date = parts[0].split('/');
            let time = parts[1].split(':');
            lastMsg = new Date(date[2], date[1] - 1, date[0], time[0], time[1], time[2]);

            return { name, avatar, visible, lastMsg, messages }
        });

        contactsMapped.sort((a, b) => new Date(b.lastMsg) - new Date(a.lastMsg));

        this.contacts = contactsMapped;
    },
    methods: {
        img(i) {
            return './img/avatar' + i + '.jpg';
        },
        alt(i) {
            return 'foto profilo ' + i;
        },
        index(i) {
            this.idx = i;
        },
        notifying() {
            this.notifies = !this.notifies;
        },
        modale(i) {
            this.modalDel = !this.modalDel;
            this.msgIdx = i;
        },
        notModale() {
            this.modalDel = false;
        },
        filterUser() {
            this.contacts.forEach(el => {
                el.visible = true;
                if (!el.name.toLowerCase().startsWith(this.search.toLowerCase()))
                    el.visible = false;
            });
        },
        subText(str) {
            if (str.length > 35) return str.substr(0,32) + '...';
            return str;
        },
        dateStr(a) {
            return a < 10 ? '0' + a : a;
        },
        dateText(str, arg) {
            const d = new Date();
            let dd = d.getDate();
            let mo = d.getMonth() + 1;
            let yyyy = d.getFullYear();
            let today = this.dateStr(dd) + '/' + this.dateStr(mo) + '/' + yyyy;

            let parts = str.split(' ');
            let date = parts[0];
            let time = parts[1];

            if (arg)
                return today === date ? ('Oggi ' + time.substr(0, 5)) : date;
            else
                return (today === date ? 'oggi' : date) + ' ' + time.substr(0, 5);
        },
        deleteMsg(i) {
            if (this.contacts[this.idx].messages.length === 1) {
                this.contacts[this.idx].messages = [{
                    date: '',
                    text: 'No available messages',
                    status: 'no-msg'
                }];
            } else {
                this.contacts[this.idx].messages.splice(i, 1);
            }
            this.modalDel = false;
        },
        newDate() {
            const d = new Date();
            let dd = d.getDate();
            let mo = d.getMonth() + 1;
            let yyyy = d.getFullYear();
            let hh = d.getHours();
            let mi = d.getMinutes();
            let ss = d.getSeconds();

            return [this.dateStr(dd) + '/' + this.dateStr(mo) + '/' + yyyy + ' ' + this.dateStr(hh) + ':' + this.dateStr(mi) + ':' + this.dateStr(ss), d];
        },
        scrollBtm() {
            let d = document.querySelector('.msgs-container');
            d.scrollTop = d.scrollHeight;
        },
        newMsg(str, stat) {
            let date = this.newDate();
            this.contacts[this.idx].messages.push({
                date: date[0],
                text: str,
                status: stat
            });

            this.contacts[this.idx].lastMsg = date[1];

            setTimeout(this.scrollBtm, 100);

            this.contacts = this.contacts.sort((a, b) => new Date(b.lastMsg) - new Date(a.lastMsg));
        },
        newMsgReceived() {
            this.newMsg('Ok champ!', 'received');
        },
        newMsgSent() {
            if (this.message.trim().length > 0) {
                if (this.contacts[this.idx].messages.length === 1 && this.contacts[this.idx].messages[0].status === 'no-msg') {
                    this.contacts[this.idx].messages = [];
                }
                this.newMsg(this.message, 'sent');
                this.message = '';
                this.idx = 0;
                setTimeout(this.newMsgReceived, 2000);
            }
        }
    }
});
Vue.config.devtools = true;