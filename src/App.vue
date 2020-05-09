<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        bottom
        color="pink"
      ></v-progress-linear>
    </v-app-bar>

    <v-content>
      <v-container grid-list-md>
        <div class="text-center">
          <form ref="myForm">
            <v-row>
              <v-col cols="12" md="9">
                <h1>User Form</h1>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="name"
                  :error-messages="nameErrors"
                  label="Name"
                  required
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="email"
                  :error-messages="emailErrors"
                  label="E-mail"
                  required
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model.number="age"
                  :error-messages="ageErrors"
                  label="Age"
                  required
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3" class="d-flex align-md-center">
                <v-btn
                  :disabled="$v.$invalid"
                  color="success"
                  class="mr-4"
                  @click.prevent="submit($event)"
                >
                  Submit
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </div>
      </v-container>
      <!-- <v-btn color="success" @click="loading=!loading">Load</v-btn> -->
      <v-container grid-list-md>
        <v-row v-show="loading">
          <v-col cols="12" md="9">
            <v-skeleton-loader
              ref="skeleton"
              :boilerplate="true"
              :type="'table-row-divider@6'"
              :tile="false"
              class="mx-auto"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
        <v-row v-if="rdata" v-show="!loading" class="text-center">
          <v-col cols="12" md="9">
            <v-simple-table fixed-header height="500px">
              <template v-slot:default>
                <thead>
                  <tr class="text-center">
                    <th class="text-center">Name</th>
                    <th class="text-center">Age</th>
                    <th class="text-center">Email</th>
                    <th class="text-center">Delete ?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(d, index) in rdata" :key="index">
                    <td scope="row">{{ d.name }}</td>
                    <td>{{ d.age }}</td>
                    <td>{{ d.email }}</td>
                    <td>
                      <v-btn color="error" @click="delRec(index)">Delete</v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { required, email, between } from "vuelidate/lib/validators";
export default {
  props: {
    source: String
  },
  data: () => ({
    loading: true,
    drawer: false,
    name: "",
    email: "",
    password: "",
    age: "",
    rdata: ""
  }),
  methods: {
    submit(event) {
      event.preventDefault();

      this.loading = true;
      const url = "https://ng-firebase-f53ec.firebaseio.com/vue.json";
      this.$http.post(url, this.fdata).then(
        () => {
          this.fetchdata();
          this.$v.$reset();

          Object.assign(this.$data, this.$options.data.call(this));
          this.loading = false;
        },
        error => {
          console.log(error);
          this.loading = false;
        }
      );
    },
    fetchdata() {
      this.$v.$reset();
      this.loading = true;
      const url = "https://ng-firebase-f53ec.firebaseio.com/vue.json";
      this.$http
        .get(url)
        .then(response => {
          return response.json();
        })
        .then(
          response => {
            if (response) {
              this.rdata = response;
            }
            this.loading = false;
          },
          error => {
            console.log(error);
            this.loading = false;
          }
        );
    },
    delRec(val) {
      this.loading = true;
      const url =
        "https://ng-firebase-f53ec.firebaseio.com/vue/" + val + ".json";
      this.$http
        .delete(url)
        .then(response => {
          return response.json();
        })
        .then(
          response => {
            this.fetchdata();
            if (response) {
              console.log(response);
            }
            this.loading = false;
          },
          error => {
            console.log(error);
            this.loading = false;
          }
        );
    }
  },
  created() {
    this.fetchdata();
  },

  computed: {
    fdata: function() {
      return {
        name: this.name,
        email: this.email,
        age: this.age
      };
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    ageErrors() {
      const errors = [];
      if (!this.$v.age.$dirty) return errors;
      !this.$v.age.between.email && errors.push("Age in invalid");
      !this.$v.age.required && errors.push("Age is required");
      return errors;
    }
  },
  validations: {
    name: {
      required
    },
    email: {
      required,
      email
    },
    age: {
      required,
      between: between(18, 70)
    }
  }
};
</script>
