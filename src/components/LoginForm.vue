<template>
 <!-- Login Form -->
    <div class="text-white text-center font-bold p-5 mb-4"
           v-if="login_show_alert" :class="login_alert_variant">
            {{ login_alert_message }}
          </div>
          <vee-form :validation-schema="loginSchema" @submit="login">
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2"   for="Email">Email</label>
              <vee-field type="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
                <ErrorMessage class="text-red-600" name="email"/>
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2" for="Password">Password</label>
              <vee-field type="password" name="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />
                 <ErrorMessage class="text-red-600" name="Password"/>
            </div>
            <button type="submit" :disabled="login_in_submission"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700" >
              Submit
            </button>
          </vee-form>
</template>

<script>

export default {
    name: 'LoginForm',
    data() {
       return {
            loginSchema: {
             email: 'required|email',
             password: 'required|min:2|max:10|',
            },
                  login_in_submission: false,
                  login_show_alert: false,
                  login_alert_variant: 'bg-blue-600',
                  login_alert_message: 'Please wait! We are logging you in.',
       };
    },
    methods: {
    async login(values) {
        this.login_in_submission = true;
        this.login_show_alert = true;
        this.login_alert_variant = 'bg-blue-600';
        this.login_alert_message = 'Please wait! We are logging you in.';

        try {
          await this.$store.dispatch('login', values);
        } catch (e) {
          this.login_show_alert = true;
          this.login_alert_variant = 'bg-red-600';
          this.login_alert_message = 'Error: Invalid email or password';
          this.login_in_submission = false;
          throw e;
        }

         this.login_alert_variant = 'bg-green-600';
         this.login_alert_message = 'Login successful!';

          window.location.reload();
    },
    },
};
</script>
