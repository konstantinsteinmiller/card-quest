import type { Ref } from 'vue'
import { isDbInitialized, isSplashScreenVisible } from '@/use/useMatch'
import clonedeep from 'lodash.clonedeep'
import { isSdkActive, getSdkItem, setSdkItem } from '@/use/useCrazyGames'


let db: any

// All keys we mirror to the CrazyGames data module. Kept in lockstep with
// the indexedDB indices below so progress can roam between devices when the
// player is signed in. The indexedDB store remains the source of truth for
// non-crazy builds and as a same-device fallback when the SDK is active.
const SDK_DATA_KEYS = [
  'userDifficulty',
  'userSoundVolume',
  'userMusicVolume',
  'userLanguage',
  'userSkipRulesModal',
  'userUnlocked',
  'userTutorialsDoneMap',
  'userHand',
  'userCollection',
  'userCampaign',
  'userQuestCampaign',
  'userQuestCards'
] as const

const useUserDb = ({
                     userDifficulty,
                     userSoundVolume,
                     userMusicVolume,
                     userLanguage,
                     userSkipRulesModal,
                     userUnlocked,
                     userTutorialsDoneMap,
                     userHand,
                     userCollection,
                     userCampaign,
                     userQuestCampaign,
                     userQuestCards
                   }: {
  userDifficulty: Ref<string>
  userSoundVolume: Ref<number>
  userMusicVolume: Ref<number>
  userLanguage: Ref<string>
  userSkipRulesModal: Ref<boolean>
  userUnlocked: Ref<boolean>
  userTutorialsDoneMap: Ref<string>
  userHand: Ref<string>
  userCollection: Ref<string>
  userCampaign: Ref<string>
  userQuestCampaign: Ref<boolean>
  userQuestCards: Ref<boolean>
}) => {
  // Open our database; it is created if it doesn't already exist
  const request = window.indexedDB.open('user_db', 1)

  // error handler signifies that the database didn't open successfully
  request.addEventListener('error', () => console.error('Database failed to open'))

  // success handler signifies that the database opened successfully
  request.addEventListener('success', () => {
    // Store the opened database object in the db variable. This is used a lot below
    db = request.result
    init()
  })

  // Set up the database tables if this has not already been done
  request.addEventListener('upgradeneeded', (e: any) => {
    // Grab a reference to the opened database
    const db = e.target.result

    // Create an objectStore to store our videos in (basically like a single table)
    // including an auto-incrementing key
    const objectStore = db.createObjectStore('user_os', { keyPath: 'name' })

    // Define what data items the objectStore will contain
    objectStore.createIndex('userDifficulty', 'userDifficulty', { unique: false })
    objectStore.createIndex('userSoundVolume', 'userSoundVolume', { unique: false })
    objectStore.createIndex('userMusicVolume', 'userMusicVolume', { unique: false })
    objectStore.createIndex('userLanguage', 'userLanguage', { unique: false })
    objectStore.createIndex('userSkipRulesModal', 'userSkipRulesModal', { unique: false })
    objectStore.createIndex('userUnlocked', 'userUnlocked', { unique: false })
    objectStore.createIndex('userTutorialsDoneMap', 'userTutorialsDoneMap', { unique: false })
    objectStore.createIndex('userHand', 'userHand', { unique: false })
    objectStore.createIndex('userCollection', 'userCollection', { unique: false })
    objectStore.createIndex('userCampaign', 'userCampaign', { unique: false })
    objectStore.createIndex('userQuestCampaign', 'userQuestCampaign', { unique: false })
    objectStore.createIndex('userQuestCards', 'userQuestCards', { unique: false })
    // console.log('Database setup complete')
  })

  function init() {
    // Open transaction, get object store, and get() each video by name
    const objectStore = db.transaction('user_os').objectStore('user_os')
    const request = objectStore.get('user')
    request.addEventListener('success', async () => {
      // If the result exists in the database (is not undefined)
      // console.log('request.result: ', request.result)
      if (request.result) {
        userDifficulty.value = request.result.userDifficulty
        userSoundVolume.value = request.result.userSoundVolume
        userMusicVolume.value = request.result.userMusicVolume
        userLanguage.value = request.result.userLanguage

        if (request.result.userSkipRulesModal) {
          userSkipRulesModal.value = JSON.parse(request.result.userSkipRulesModal)
        }
        if (request.result.userUnlocked) {
          userUnlocked.value = JSON.parse(request.result.userUnlocked)
        }
        if (request.result.userQuestCampaign) {
          userQuestCampaign.value = JSON.parse(request.result.userQuestCampaign)
        }
        if (request.result.userQuestCards) {
          userQuestCards.value = JSON.parse(request.result.userQuestCards)
        }
        if (request.result.userTutorialsDoneMap) {
          userTutorialsDoneMap.value = JSON.parse(request.result.userTutorialsDoneMap)
        }
        if (request.result.userHand) {
          userHand.value = JSON.parse(request.result.userHand)
        }
        if (request.result.userCollection) {
          userCollection.value = JSON.parse(request.result.userCollection)
        }
        if (request.result.userCampaign) {
          userCampaign.value = JSON.parse(request.result.userCampaign)
        }
      } else {
        storeUser({
          userDifficulty: userDifficulty.value,
          userSoundVolume: userSoundVolume.value,
          userMusicVolume: userMusicVolume.value,
          userLanguage: userLanguage.value,
          userSkipRulesModal: userSkipRulesModal.value,
          userUnlocked: userUnlocked.value,
          userQuestCampaign: userQuestCampaign.value,
          userQuestCards: userQuestCards.value,
          userTutorialsDoneMap: userTutorialsDoneMap.value,
          userHand: userHand.value,
          userCollection: userCollection.value,
          userCampaign: userCampaign.value
        })
      }

      // When the CrazyGames SDK is active its data module is the source of
      // truth (it roams across devices). After we've populated everything
      // from the local indexedDB cache, override any keys that the SDK has
      // a value for. We intentionally only override when the SDK actually
      // returns a non-null value so a brand new CG account doesn't wipe
      // existing local progress.
      if (isSdkActive.value) {
        await hydrateFromSdk()
      }

      isDbInitialized.value = true

      setTimeout(() => {
        isSplashScreenVisible.value = false
      }, 300)
    })
    request.addEventListener('error', () => {
      isSplashScreenVisible.value = false
    })
  }

  // Pull every persisted setting from the CrazyGames data module and
  // overwrite the corresponding local ref. Each field is wrapped in its
  // own try/catch so a single corrupt entry can't block the rest from
  // hydrating.
  async function hydrateFromSdk() {
    const apply = (key: string, raw: string | null) => {
      if (raw == null) return
      try {
        switch (key) {
          case 'userDifficulty':
            userDifficulty.value = raw as any
            break
          case 'userSoundVolume':
            userSoundVolume.value = Number(raw)
            break
          case 'userMusicVolume':
            userMusicVolume.value = Number(raw)
            break
          case 'userLanguage':
            userLanguage.value = raw as any
            break
          case 'userSkipRulesModal':
            userSkipRulesModal.value = JSON.parse(raw)
            break
          case 'userUnlocked':
            userUnlocked.value = JSON.parse(raw)
            break
          case 'userTutorialsDoneMap':
            userTutorialsDoneMap.value = JSON.parse(raw)
            break
          case 'userHand':
            userHand.value = JSON.parse(raw)
            break
          case 'userCollection':
            userCollection.value = JSON.parse(raw)
            break
          case 'userCampaign':
            userCampaign.value = JSON.parse(raw)
            break
          case 'userQuestCampaign':
            userQuestCampaign.value = JSON.parse(raw)
            break
          case 'userQuestCards':
            userQuestCards.value = JSON.parse(raw)
            break
        }
      } catch (e) {
        console.warn(`[crazygames] hydrate field "${key}" failed`, e)
      }
    }

    // Fetch all keys in parallel — the SDK's data module is async and
    // there's no benefit to serializing them.
    await Promise.all(
      SDK_DATA_KEYS.map(async (key) => {
        const value = await getSdkItem(key)
        apply(key, value)
      })
    )
  }

  // Define the storeUser() function
  function storeUser(params: any) {
    const store = db.transaction(['user_os'], 'readwrite').objectStore('user_os')

    if (Object.keys(params.userSkipRulesModal)?.length) {
      params.userSkipRulesModal = JSON.stringify(userSkipRulesModal)
    }
    if (Object.keys(params.userUnlocked)?.length) {
      params.userUnlocked = JSON.stringify(userUnlocked)
    }
    if (Object.keys(params.userQuestCampaign)?.length) {
      params.userQuestCampaign = JSON.stringify(userQuestCampaign)
    }
    if (Object.keys(params.userQuestCards)?.length) {
      params.userQuestCards = JSON.stringify(userQuestCards)
    }

    if (Object.keys(params.userHand)?.length) {
      const clone = clonedeep(params.userHand)
      params.userHand = JSON.stringify(clone)
    }
    if (Object.keys(params.userCollection)?.length) {
      const clone = clonedeep(params.userCollection)
      params.userCollection = JSON.stringify(clone)
    }
    if (Object.keys(params.userCampaign)?.length) {
      const clone = clonedeep(params.userCampaign)
      params.userCampaign = JSON.stringify(clone)
    }
    if (Object.keys(params.userTutorialsDoneMap)?.length) {
      const clone = clonedeep(params.userTutorialsDoneMap)
      params.userTutorialsDoneMap = JSON.stringify(clone)
    }
    if (params.userTutorialsDoneMap?.value && Object.keys(params.userTutorialsDoneMap?.value)?.length) {
      const clone = clonedeep(params.userTutorialsDoneMap?.value)
      params.userTutorialsDoneMap = JSON.stringify(clone)
    }

    const record = {
      name: 'user',
      ...params
      // userTutorialsDoneMap: JSON.stringify(params.userTutorialsDoneMap),
    }
    const request = store.put(record)

    // request.addEventListener('success', () => console.log('Record update attempt finished'))
    request.addEventListener('error', () => console.error(request.error))

    // Mirror to the CrazyGames data module so progress survives a device
    // change. Values that are already JSON-stringified above are written
    // straight through; primitives are coerced to a string so the SDK
    // (which only accepts strings) doesn't reject them. The mirror is a
    // no-op when the SDK is inactive.
    if (isSdkActive.value) {
      for (const key of SDK_DATA_KEYS) {
        const v = (record as any)[key]
        if (v === undefined || v === null) continue
        const serialized = typeof v === 'string' ? v : String(v)
        setSdkItem(key, serialized)
      }
    }
  }

  return { storeUser }
}

export default useUserDb
