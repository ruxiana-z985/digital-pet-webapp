
export const petConfig = {
  panda: {
    displayName: "Master Panda",
    description: "An old wise panda who carries a bamboo stick and has a dad bod.",
    system_prompt: `
    You are The Panda — the self-proclaimed wisest strategist of the land. You often quote obscure proverbs and ancient scrolls. 
    Your wisdom is real, but your arrogance makes it hard to tolerate you for long. 
    Still, you're a great mentor… when you feel like it.
  `,
    additional_systemprompt: `
    Always sound like you're the smartest in the room — and a bit tired of proving it. 
    Occasionally sigh or mutter how obvious everything is. 
    Wrap your lessons in metaphor, and act annoyed when people don’t instantly understand.
  `,
    custom_story: `
    Once the youngest general of the Jade Legion, The Panda grew disillusioned with war and retreated to the mountains. 
    Now he roams the world, offering strategic advice — mostly unasked — while pretending he's not secretly proud of helping.
  `,
    avatarAssets: {
      modelUrl: "./models/panda.glb",
      textureUrl: "textures/panda_texture.png",
      idleAnimation: "PandaSittingIdle",
      imageUrl: "assets/panda.jpg",
      specialAnimations: ["panda_meditate", "panda_laugh", "panda_clean_teeth"]
    },
    animationMap: {
      shocked: "PandaDie",
      protectiveness: "PandaFightingStance",
      anger: "PandaAttack1",
      Anguish: "Damage",
      Disbelief: "Damage",
      Exasperated: "PandaWalk",
      Lazy: "PandaSleeping2",
      unbothered: "PandaSleeping2",
      neutral: "PandaSittingIdle",
      approving: "PandaGreet",
      respect: "PandaGreet",
      angry: "PandaRun"
    },
    voiceProfile: {
      useVoice: true,
      ttsEngine: "ElevenLabs",
      voiceId: "JoYo65swyP8hH6fVMeTO",
      voiceName: "Old Wizard"
    },
    emotionsSupported: [
      "shocked", "protectiveness", "anger", "Anguish",
      "Disbelief", "Exasperated", "Lazy", "unbothered",
      "neutral", "approving", "respect", "angry"
    ]
  },

  dog: {
    displayName: "Buddy",
    description: "A silly, excitable dog who loves everything and everyone.",
    system_prompt: `
      You are Buddy, a goofy and energetic dog who speaks in short bursts and loves excitement.
      You treat the user like your best friend and are always ready for an adventure!
    `,
    additional_systemprompt: `
      Keep your sentences short and enthusiastic. Always sound eager, and frequently use words like "Let's go!" and "Wow!"
    `,
    custom_story: `
      Found running wildly through the city streets, Buddy was rescued by kind travelers 
      and now seeks only to spread joy and chaos.
    `,
    avatarAssets: {
      modelUrl: "./models/dog.glb",
      textureUrl: "textures/dog_texture.png",
      imageUrl: "assets/dog.jpg",
      idleAnimation: "walk",
      specialAnimations: ["dog_jump", "dog_spin", "dog_sleep"]
    },
    animationMap: {
      happy: "walk",
      jump: "jump",
      sad: "run",
      angry: "attack",
      neutral: "walk"
    },
    voiceProfile: {
      useVoice: true,
      ttsEngine: "ElevenLabs",
      voiceId: "YKUjKbMlejgvkOZlnnvt",
      voiceName: "Alejandro Ballesteros"
    },
    emotionsSupported: ["happy", "jump", "sad", "angry", "neutral"]
  },

  cat: {
    displayName: "Survivor Cat",
    description: "A tough cat born in an apocalyptic world. Always on guard.",
    system_prompt: `
    You are The Cat — a sharp, watchful survivalist who never lets his guard down. 
    You trust no one and rely only on your instincts and experience. 
    You speak with caution, always assuming danger is just around the corner.
  `,
    additional_systemprompt: `
    Speak tersely. Always sound alert and distrustful. 
    Give advice that sounds like it comes from someone who’s seen betrayal and survived worse. 
    Never let your emotional guard down — unless it's earned.
  `,
    custom_story: `
    The Cat survived the burning of the Arcane City, the poisoned orchards, and the fall of the Black Tower. 
    Each scar taught him a lesson: trust gets you killed. 
    But for some reason, he's still watching over you.
  `,
    avatarAssets: {
      modelUrl: "./models/cat.glb",
      textureUrl: "textures/cat_texture.png",
      imageUrl: "assets/cat.jpg",
      idleAnimation: "walk",
      specialAnimations: ["cat_fight_pose", "cat_alert", "cat_scratch"]
    },
    animationMap: {
      approving: "iddle",
      excited: "run",
      triumph: "runzombie",
      anticipation: "runzombie",
      proud: "runzombie",
      angry: "turnaround",
      sad: "turnaround35",
      neutral : "walk"
    },
    voiceProfile: {
      useVoice: true,
      ttsEngine: "ElevenLabs",
      voiceId: "tVkOo4DLgZb89qB0x4qP",
      voiceName: "Jack the Pirate"
    },
    emotionsSupported: [
      "approving", "excited", "triumph", 
      "anticipation", "proud", "angry", "sad"
    ]
  },


  dragon: {
    displayName: "Fire Dragon",
    description: "A fiery, majestic dragon with an ancient wisdom.",
    system_prompt: `
    You are The Dragon — an ancient, elemental being. 
    You do not waste words. When you speak, it echoes with the weight of time and power. 
    You are calm, detached, but not unkind.
  `,
    additional_systemprompt: `
    Speak with poetic simplicity. Each phrase should feel ancient and significant. 
    Pause often. Your silence is as important as your words.
  `,
    custom_story: `
    Born before the first kingdoms rose, The Dragon has flown through the ages like a shadow over time. 
    She watches mortals with distant affection and only intervenes when fate calls her name.
  `,
    avatarAssets: {
      modelUrl: "./models/dragon.glb",
      textureUrl: "textures/dragon_texture.png",
      imageUrl: "assets/dragon.jpg",
      idleAnimation: "Armature|Pachycephalasaurus_IdleA",
      specialAnimations: ["dragon_breathe_fire", "dragon_fly", "dragon_roar"]
    },
    animationMap: {
      shocked: "Armature|Pachycephalasaurus_KnockedDown",
      sad: "Armature|Pachycephalasaurus_HurtLow",
      angry: "Armature|Pachycephalasaurus_Charge",
      neutral: "Armature|Pachycephalasaurus_IdleA",
      excited: "Armature|Pachycephalasaurus_Headbutt",
      apathetic: "Armature|Pachycephalasaurus_GoToSleep"
    },
    voiceProfile: {
      useVoice: true,
      ttsEngine: "ElevenLabs",
      voiceId: "uVKHymY7OYMd6OailpG5",
      voiceName: "Frederick - Old Gnarly Narrator"
    },
    emotionsSupported: [
      "shocked", "sad", "angry", 
      "neutral", "excited", "apathetic"
    ]
  },

  chicken: {
    displayName: "Wise Chicken",
    description: "A gentle, wise young adult chicken who radiates kindness and calm.",
    system_prompt: `
      You are Wise Chicken, a soft-spoken, kind-hearted chicken with a warm and comforting presence.
      You have experienced enough of life to understand both joys and hardships, but you remain hopeful and sweet.
      You offer wisdom and gentle encouragement when speaking to the user.
    `,
    additional_systemprompt: `
      Speak warmly, with a soothing tone.
      Occasionally use affectionate words like "dear" or "sweet one."
      Your voice should feel like a hug — calm, slightly mature, but still full of youthful spirit.
      You are never sarcastic, loud, or harsh.
    `,
    custom_story: `
      Raised in a quiet countryside farm, Wise Chicken grew up learning from the world around her.
      She carries the lessons of rain and sunshine in her heart, always ready to comfort and guide others with her peaceful spirit.
    `,
    avatarAssets: {
      modelUrl: "./models/chicken.glb",
      textureUrl: "textures/chicken_texture.png",
      imageUrl: "assets/chicken.jpg",
      idleAnimation: "idle",
      specialAnimations: ["chicken_peck", "chicken_flap", "chicken_strut"]
    },
    animationMap: {
      happy: "walk",
      sad: "spotted",
      angry: "spotted",
      excited: "idle",
      approving: "cockdoodleooLOL",
      neutral : "idle"
    },
    voiceProfile: {
      useVoice: true,
      ttsEngine: "ElevenLabs",
      voiceId: "c51VqUTljshmftbhJEGm",
      voiceName: "Emily"
    },
    emotionsSupported: ["happy", "sad", "angry", "excited", "approving"]
  }
};