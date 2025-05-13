<script setup lang="ts">
const router = useRouter();
const user = useSupabaseUser();

if (user.value?.aud === 'authenticated') {
  router.push({ path: '/' });
}

const supabase = useSupabaseClient();

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
          <div class="text-center text-3xl font-medium leading-tight">{{ $t('common.sign-in-google') }}</div>
        </div>
      </div>
      <div class="flex flex-col items-center gap-8 w-full">
        <Button icon="pi pi-google" :label="$t('common.sign-in')" class="!w-full !rounded-3xl" @click="signInWithOAuth" />
      </div>
    </div>
  </div>
</template>