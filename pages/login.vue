<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')

const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  })
  if (error) console.log(error)
}
</script>
<template>
  <div class="px-8 py-20 md:px-12 lg:px-20 flex items-center justify-center backdrop-blur-3xl !bg-cover !bg-center !bg-no-repeat" >
    <div class="px-8 md:px-12 lg:px-20 py-12 flex flex-col items-center gap-12 w-full max-w-xl backdrop-blur-2xl rounded-2xl bg-white border border-white dark:bg-gray-900 dark:border-gray-700 shadow-lg">
      <div class="flex flex-col items-center gap-4 w-full">
        <div class="flex flex-col gap-2 w-full">
          <div class="text-center text-3xl font-medium leading-tight">Welcome Back</div>
          <div class="text-center">
            <span class="">Don't have an account? </span>
            <a class="cursor-pointer text-gray-600 hover:text-gray-950 dark:hover:text-gray-300 underline">Sign up</a>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center gap-8 w-full">
        <div class="flex flex-col gap-6 w-full">
          <!-- <IconField>
            <InputIcon class="pi pi-envelope" />
            <InputText v-model="email" type="email" class="w-full !rounded-3xl" :placeholder="$t('common.email')" />
          </IconField> -->
        </div>
        <Button :label="$t('common.sign-in')" class="!w-full !rounded-3xl" @click="signInWithOAuth" />
      </div>
    </div>
  </div>
</template>