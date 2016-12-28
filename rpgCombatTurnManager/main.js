window.Event = new Vue();

Vue.component('combat-list', {
    template: `
    <div>
        <div class="columns">
            <div class="column has-text-centered is-half">
                <p class="notification is-primary"> Nome </p>
            </div>
            <div class="column has-text-centered">
                <p class="notification is-primary"> Iniciativa </p>
            </div>
            <div class="column has-text-centered">
                <p class="notification is-primary"> Life Points </p>
            </div>
            <div class="column has-text-centered is-one-quarter">
                <p class="notification is-primary"> Dano e Cura </p>
            </div>
        </div>
        <combat-member v-for="member in members" :name="member.name" :hit-points="member.hitPoints" :initiative="member.initiative"></combat-member>
        <div class="columns">
            <div class="column has-text-centered">
                <h1 class="notification is-warning"><strong>TURNO: {{ this.turn }}</strong></h1>
            </div>
            <div class="column is-2 has-text-centered">
                <h1 class="notification is-success is-outlined nextTurn" @click="showAddMemberModal"><strong>ADD MEMBER</strong></h1>
            </div>
            <div class="column is-2 has-text-centered">
                <h1 class="notification is-success is-outlined nextTurn" @click="updateTurn"><strong>NEXT</strong></h1>
            </div>
        </div>
        <add-member-modal></add-member-modal>
    </div>
    `,

     data() {
        return {
            members: [],
            turn: 1
        };
    },

    methods: {
        loadAnotherMember(newMember) {
            this.members.push(newMember);
            this.members.sort(this.compareInitiatives);
        },

        compareInitiatives(combatentOne, combatentTwo) {
            if (combatentOne.initiative < combatentTwo.initiative)
              return 1;
            if (combatentOne.initiative > combatentTwo.initiative)
              return -1;
            return 0;
        },

        updateTurn() {
            this.turn +=1;
        },

        showAddMemberModal() {
            Event.$emit('showAddMemberModal');
        }
    },
    created() {
        Event.$on("addNewMember", (newMember) => {
            this.loadAnotherMember(newMember);
        });
    }
});

Vue.component('combat-member', {
    template: `
    <div class="columns">
        <div class="column has-text-centered is-half" style="pading: auto;">
            <p :class="combatMemberActiveClass"> {{ this.name }} </p>
        </div>
        <div class="column has-text-centered">
            <p :class="combatMemberActiveClass"> {{ this.initiative }} </p>
        </div>
        <div class="column has-text-centered">
            <p :class="combatMemberActiveClass"> {{ this.hitPoints }} </p>
        </div>
        <div class="column has-text-centered is-one-quarter">
            <p :class="combatMemberActiveClass">
                <a class="button">+1</a>
                <a class="button">-1</a>
                <a class="button">+5</a>
                <a class="button">-5</a>
            </p>
        </div>
    </div>
    `,

    props: {
        name: {
            required: true
        },
        initiative: {
            required: true
        },
        hitPoints: {
            required: true
        }
    },
    computed: {
        combatMemberActiveClass: function () {
            return "notification " + (this.activeInTurn?"is-success":"is-info");
        }
    },

    data() {
        return {
            activeInTurn: false
        };
    }
});

Vue.component('add-member-modal', {
    template: `
        <div :class="modalVisibility">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Adicionar Novo Membro</p>
            </header>
            <section class="modal-card-body">
                <label class="label">Nome</label>
                <p class="control">
                  <input class="input" id="newMemberName" type="text">
                </p>
                <label class="label">Iniciativa</label>
                <p class="control">
                  <input class="input" id="newMemberInitiative" type="text">
                </p>
                <label class="label">Vida</label>
                <p class="control">
                  <input class="input" id="newMemberLifePoint" type="text">
                </p>
            </section>
            <footer class="modal-card-foot">
              <a class="button is-primary" @click="addNewMember">Adicionar</a>
              <a class="button" @click="hideModal">Cancelar</a>
            </footer>
          </div>
        </div>
    `,
    data() {
        return {
            isVisible: false
        };
    },

    computed: {
        modalVisibility: function () {
            return "modal " + (this.isVisible?"is-active":"");
        }
    },
    methods: {
        hideModal() {
            this.isVisible = false;
        },

        addNewMember() {
            let newMemberName = document.getElementById('newMemberName').value;
            let newMemberInitiative = document.getElementById('newMemberInitiative').value;
            let newMemberLifePoint = document.getElementById('newMemberLifePoint').value;

            document.getElementById('newMemberName').value = "";
            document.getElementById('newMemberInitiative').value = "";
            document.getElementById('newMemberLifePoint').value = "";

            newMember = {name:newMemberName, hitPoints:newMemberInitiative, initiative:newMemberLifePoint},
            Event.$emit("addNewMember", newMember);
        }
    },

    created() {
        Event.$on('showAddMemberModal', () => {
            this.isVisible = true;
        });
    }
});

new Vue({
    el: "#root"
});