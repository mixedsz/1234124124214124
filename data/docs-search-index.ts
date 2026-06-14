export interface DocsSearchEntry {
  href: string;
  title: string;
  section?: string;
  content: string;
}

export const DOCS_SEARCH_INDEX: DocsSearchEntry[] = [
  {
    href: '/docs',
    title: 'Documentation',
    content: 'Central hub for Flake Development scripts. Installation guides, troubleshooting, quick start steps, server artifact requirements, asset download instructions, ESX QBCore framework setup.',
  },
  {
    href: '/docs/escrow-errors',
    title: 'FiveM Escrow Errors',
    content: 'Troubleshooting guide for escrow and Keymaster errors on FiveM. Syntax errors, resource verification failures, entitlement issues, server key configuration, purchased scripts not loading.',
  },
  {
    href: '/docs/smoking',
    title: 'Flake Smoking & Vaping',
    section: 'Overview',
    content: 'Premium smoking and vaping system with 30+ strains, realistic rolling mechanics, interactive vape refills, player-to-player item passing. Dual ESX QB-Core support, configurable keybinds, health effects, dynamic visual effects, particles, speed multipliers, combat disabling, vehicle integration.',
  },
  {
    href: '/docs/smoking#installation',
    title: 'Flake Smoking & Vaping',
    section: 'Installation',
    content: 'Installation steps: drop resource into server, add items to OX Inventory or QB-Core items.lua, add images to inventory image folder, configure config.lua.',
  },
  {
    href: '/docs/smoking#configuration',
    title: 'Flake Smoking & Vaping',
    section: 'Configuration',
    content: 'Config options: SmokeButton, ThrowButton, MouthButton, HandButton, GiveButton, RefillVapeButton, MaxLiquid, VapeSizeRemove, JointsGiven, health effects, speed multipliers, combat disabling, notification system.',
  },
  {
    href: '/docs/shops',
    title: 'Flake Shops',
    section: 'Overview',
    content: 'Fully dynamic in-game shop creator for FiveM. Database-driven inventory, multi-currency support cash bank black-money, optional pickup mechanics, shop NPCs, Discord logging, ESX QB-Core auto-detection, analytics, custom UI color.',
  },
  {
    href: '/docs/shops#installation',
    title: 'Flake Shops',
    section: 'Installation',
    content: 'Installation: add resource, import SQL, configure database, set framework in config. Requires oxmysql or mysql-async.',
  },
  {
    href: '/docs/shops#configuration',
    title: 'Flake Shops',
    section: 'Configuration',
    content: 'Config options: Config.Debug, Config.UiColor, Config.AdminGroups, Config.DrawDistance, Config.InventoryImgUrl, Config.UsePickup, Config.PickupRadius, Config.PickupWaitTime, Discord webhook logging, blip settings.',
  },
  {
    href: '/docs/addiction',
    title: 'Flake Addiction',
    section: 'Overview',
    content: 'Drug addiction system with real-time immunity tracking, withdrawal effects, overdose mechanics, configurable medications. ESX framework MySQL persistence, in-game admin creator panel for drug definitions.',
  },
  {
    href: '/docs/addiction#configuration',
    title: 'Flake Addiction',
    section: 'Configuration',
    content: 'Config: Config.UIColor, Config.AdminGroups, Config.DrugImmunity, Config.UsableDrugs, Config.Medication, drugStrength, addiction.chance, addiction.time, effect.duration, withdrawal animations, overdose handling.',
  },
  {
    href: '/docs/flake_scoreboard',
    title: 'Flake Scoreboard',
    section: 'Overview',
    content: 'Advanced player scoreboard with job counters, staff badges, player history tracking, search functionality. Supports ESX and QBCore, customizable UI colors, job categories, staff rank badges.',
  },
  {
    href: '/docs/flake_scoreboard#configuration',
    title: 'Flake Scoreboard',
    section: 'Configuration',
    content: 'Config: Config.Framework, Config.UseCharacterNames, Config.ServerName, Config.ServerIcon, Config.OpenKey, Config.Command, Config.JobCategories, Config.StaffRanks, Config.CounterIcons, test mode.',
  },
  {
    href: '/docs/flake_aiems',
    title: 'Flake AI EMS',
    section: 'Overview',
    content: 'AI-driven EMS revival system that spawns paramedic NPCs when real ambulance players are offline. Dynamic ambulance spawning, payment options cash card, optional crutch injuries, restricted zones, compatible with Wasabi and AK47 ambulance resources.',
  },
  {
    href: '/docs/flake_aiems#configuration',
    title: 'Flake AI EMS',
    section: 'Configuration',
    content: 'Config: Config.Command, Config.RevivalCost, Config.EMSModel, Config.AmbulanceModel, Config.EMSSpeed, Config.DynamicSpawn, Config.CrutchSystem, Config.FreeRevival, Config.CheckAmbulanceOnline, hospital locations, restricted zones.',
  },
  {
    href: '/docs/flake_blackmarkets',
    title: 'Flake Blackmarkets',
    section: 'Overview',
    content: 'Hidden illicit shop system with configurable black market locations, direct or delayed pickup delivery, custom currencies, NPC vendors, map blips, Discord webhook logging. ESX QB-Core server-side validation.',
  },
  {
    href: '/docs/flake_blackmarkets#configuration',
    title: 'Flake Blackmarkets',
    section: 'Configuration',
    content: 'Config: Config.Debug, Config.DrawDistance, Config.Size, Config.Color, Config.Type, Config.InventoryImgUrl, SaleType, UsePickup, UsePed, black money currency, admin groups.',
  },
  {
    href: '/docs/flake_bodybag',
    title: 'Flake Bodybag',
    section: 'Overview',
    content: 'Professional death-handling system with bodybagging, coffin placement, burial mechanics, character kill CK system with full database backup. CK restoration with Gulag integration. ESX QBX QB-Core, ox_target TextUI interactions.',
  },
  {
    href: '/docs/flake_bodybag#configuration',
    title: 'Flake Bodybag',
    section: 'Configuration',
    content: 'Config: Config.System, Config.Debug, Config.AdminGroups, Config.CheckDistance, Config.BodyBagItem, Config.CoffinItem, Config.Shovel, bodybagging, ocean dumping, Discord logging.',
  },
  {
    href: '/docs/flake_loading',
    title: 'Flake Loading Screen',
    section: 'Overview',
    content: 'Modern FiveM loading screen with background video playback MP4 YouTube, audio controls, server info blocks, rules display, staff showcase cards, customizable social media links.',
  },
  {
    href: '/docs/flake_loading#configuration',
    title: 'Flake Loading Screen',
    section: 'Configuration',
    content: 'Config in config.js: UIColor, Title, ServerInformation, ServerRules, Staff, SocialMedia, Locales, videos array, default_volume, background video URL.',
  },
  {
    href: '/docs/flake_onehandweapon',
    title: 'Flake One-Hand Weapons',
    section: 'Overview',
    content: 'Lightweight one-handed weapon animation system applying jerrycan-style movement clipset to weapons. Toggle via keybind or always-on mode, any weapon or whitelisted selection, ox_lib notifications.',
  },
  {
    href: '/docs/flake_onehandweapon#configuration',
    title: 'Flake One-Hand Weapons',
    section: 'Configuration',
    content: 'Config: Config.Mode, Config.WeaponCheckMode, Config.ToggleKey, Config.ToggleCooldown, Config.UseOxLib, Config.SupportedWeapons, rebindable key, admin commands.',
  },
  {
    href: '/docs/flake_physicaltherapy',
    title: 'Flake Physical Therapy',
    section: 'Overview',
    content: 'Rehabilitation system where injured players complete guided multi-step exercises at therapy locations to remove crutches. Wasabi and AK47 crutch systems, doctor slip item, EMS availability checks.',
  },
  {
    href: '/docs/flake_physicaltherapy#configuration',
    title: 'Flake Physical Therapy',
    section: 'Configuration',
    content: 'Config: Config.System, Config.Debug, Config.Distance, Config.EMSJobs, Config.EMSCount, Config.Cooldown, Config.DoctorSlipItem, Config.TherapyLocations, per-location pricing.',
  },
  {
    href: '/docs/flake_wearables',
    title: 'Flake Wearables',
    section: 'Overview',
    content: 'Equippable accessories system — chains, watches, bags, vests, decals, t-shirts via ox_lib context menu. Items apply to ped components, illenium-appearance outfit saving support, gender-specific drawable texture presets.',
  },
  {
    href: '/docs/flake_wearables#configuration',
    title: 'Flake Wearables',
    section: 'Configuration',
    content: 'Config: Config.Chains, Config.Watches, Config.Bags, Config.BulletproofVests, Config.Decals, Config.TShirts, drawable texture presets, gender support, item mapping, six wearable categories.',
  },
];
