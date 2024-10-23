import type { UserObject } from './type'

// nsec1rg53qfv09az39dlw6j64ange3cx8sh5p8np29qcxtythplvplktsv93tnr
const base: UserObject = {
  hexpubkey: '3eb45c6f15752d796fa5465d0530a5a5feb79fb6f08c0a4176be9d73cc28c40d',
  npub: 'npub18669cmc4w5khjma9gews2v995hlt08ak7zxq5stkh6wh8npgcsxslt2xjn',
  loading: false,
}

const image = '../test-profile-image.jpg'

export const UserVectors = {
  loading: { ...base, loading: true } as UserObject,
  default: { ...base, profile: { name: 'DanConwayDev', image } } as UserObject,
  display_name_only: {
    ...base,
    profile: { displayName: 'DanConwayDev', image },
  } as UserObject,
  display_name_and_name: {
    ...base,
    profile: { name: 'Dan', displayName: 'DanConwayDev', image },
  } as UserObject,
  no_image: { ...base, profile: { name: 'DanConwayDev' } } as UserObject,
  no_profile: { ...base } as UserObject,
  long_name: {
    ...base,
    profile: { name: 'Really Really Long Long Name', image },
  } as UserObject,
}

export function withName(base: UserObject, name: string): UserObject {
  return {
    ...base,
    profile: {
      ...base.profile,
      name,
    },
  } as UserObject
}
