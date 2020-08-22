export default async function ({ store, $auth, redirect }) {
  const user = await $auth.user
  if (!user) {
    const msg = 'Please login in first'
    const color = 'red'
    store.dispatch('snackalert/showSnackbar', {
      msg,
      color,
    })
    redirect('/')
  } else if (user.type !== 'Client') {
    const msg = "You don't have the right permission to view that page"
    const color = 'red'
    store.dispatch('snackalert/showSnackbar', {
      msg,
      color,
    })
    redirect('/profile')
  }
}
