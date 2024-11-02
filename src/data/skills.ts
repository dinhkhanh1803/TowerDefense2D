// Define data structure for skill configuration
interface SkillConfig {
    key: string;
    name: string;
    damage: number;
    range: number;
    cooldown: number;
    manaCost: number;
    effect: string;
    targetType: string;
}

// Skill data without creating actual Skill objects
export const skillsData: SkillConfig[] = [
    {
        key: "fireball",
        name: "Fireball",
        damage: 150,
        range: 300,
        cooldown: 10,
        manaCost: 20,
        effect: "burn",
        targetType: "single"
    },
    {
        key: "lightning_strike",
        name: "Lightning Strike",
        damage: 200,
        range: 400,
        cooldown: 15,
        manaCost: 25,
        effect: "stun",
        targetType: "single"
    },
    {
        key: "blizzard",
        name: "Blizzard",
        damage: 100,
        range: 500,
        cooldown: 20,
        manaCost: 30,
        effect: "freeze",
        targetType: "area"
    },
    {
        key: "heal",
        name: "Heal",
        damage: -200,
        range: 300,
        cooldown: 12,
        manaCost: 15,
        effect: "heal",
        targetType: "single"
    }
];
