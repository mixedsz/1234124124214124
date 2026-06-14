import { put, list } from '@vercel/blob';

export const STATIC_REVIEWS = [
  { id: 's001', discord_id: 'seed030', username: 'MvpSquad', rating: 5, content: 'Appreciate the quick responds and helping me out, if you had a rate system ill rate it 100%... Keep up the good work', verified_purchase: true, created_at: '2025-10-12T22:45:00.000Z' },
  { id: 's002', discord_id: 'seed002', username: 'WAR', rating: 5, content: "I've been buying scripts from Flake since I first started my server, and every single one has been straight 🔥. Between the open-source scripts and the custom ones he's built personally, the quality and attention to detail speak for themselves. Flake is a one-stop shop for anything you need to elevate your FiveM server. Can't recommend him enough. 💯", verified_purchase: true, created_at: '2025-10-24T10:30:00.000Z' },
  { id: 's003', discord_id: 'seed010', username: 'noface.', rating: 5, content: "Flake is more than quick service, gives you reassurance every minute in the ticket. He doesn't just take your money and go offline — once you send money he sends you the product. 10/10, fuck that 10000/10", verified_purchase: true, created_at: '2025-11-08T22:07:00.000Z' },
  { id: 's004', discord_id: 'seed011', username: 'SlapzThaDon', rating: 5, content: '1000/10 Service 💯💯💯 fast customer service and goes above and beyond to make sure you get what you need help with. Def gonna continue shopping here!!', verified_purchase: true, created_at: '2025-11-08T22:23:00.000Z' },
  { id: 's005', discord_id: 'seed012', username: 'MrWicsTV', rating: 5, content: '100000000/10... was frustrated getting a script config but Flake made sure the mission was complete ✅ before closing the ticket 💯 will be returning for more scripts fashooo', verified_purchase: true, created_at: '2025-11-15T00:25:00.000Z' },
  { id: 's006', discord_id: 'seed013', username: 'Jaqyn', rating: 5, content: "That grizzly world base so fye, Flake did his thing with every script 💯, no waiting no gimmicks. If you're looking to get it don't hesitate. Money well spent 💯‼️ ⭐️⭐️⭐️⭐️ 5 star service wtf is the yelp page", verified_purchase: true, created_at: '2025-11-15T15:08:00.000Z' },
  { id: 's007', discord_id: 'seed014', username: 'AlonzoHarris', rating: 5, content: 'Best fivem Base on the market and the scripts work better than the originals ⭐ ⭐ ⭐ ⭐ ⭐ 10stars all around no cap. Everything is drag and drop', verified_purchase: true, created_at: '2025-11-16T21:17:00.000Z' },
  { id: 's008', discord_id: 'seed017', username: 'L.A.Y.L.A', rating: 5, content: '1000/10 thank you so much for my custom teleport! i love it 😊', verified_purchase: true, created_at: '2025-12-01T14:55:00.000Z' },
  { id: 's009', discord_id: 'seed018', username: 'breezyhimself', rating: 5, content: 'MY DUDE HAS THE BESTTTT CROSSHAIR IVE EVER USED IN A CITY', verified_purchase: true, created_at: '2026-01-08T20:37:00.000Z' },
  { id: 's010', discord_id: 'seed021', username: 'Vxtone', rating: 5, content: 'this mf move fast as hell ngl, best customer service!! 10/10 highly recommend!!', verified_purchase: true, created_at: '2026-01-30T15:57:00.000Z' },
  { id: 's011', discord_id: 'seed023', username: 'ARS3LL', rating: 5, content: 'Quicc response and good service.', verified_purchase: true, created_at: '2026-04-16T20:26:00.000Z' },
  { id: 's012', discord_id: 'seed024', username: 'KING', rating: 5, content: 'If you got Flake you need no one else. Quick, fast, and very efficient, 10/10.', verified_purchase: true, created_at: '2026-05-04T07:51:00.000Z' },
  { id: 's013', discord_id: 'seed043', username: 'mdosha', rating: 5, content: 'trust worthy and honest service reliable fast and quick responding, always willing to help with little questions.', verified_purchase: true, created_at: '2025-06-05T20:05:00.000Z' },
  { id: 's014', discord_id: 'seed001', username: 'ImJustTeejayyll', rating: 5, content: 'good and fast services im talking everything yu need highly recommend ‼️🔥', verified_purchase: true, created_at: '2025-10-22T23:08:00.000Z' },
  { id: 's015', discord_id: 'seed022', username: 'Aron', rating: 5, content: 'W scripts 10/10 🤙🏼', verified_purchase: true, created_at: '2026-02-15T21:01:00.000Z' },
  { id: 's016', discord_id: 'seed029', username: 'LoyalFamKash', rating: 5, content: 'Flake 100%. Fast with the response get me right everytime', verified_purchase: true, created_at: '2026-05-24T12:03:00.000Z' },
  { id: 's017', discord_id: 'seed040', username: 'buckwi1d730', rating: 5, content: "Fastest Service I've ever had getting scripts. I will be back!!", verified_purchase: true, created_at: '2025-05-23T18:48:00.000Z' },
  { id: 's018', discord_id: 'seed035', username: 'Kenzo14', rating: 5, content: 'the best 1000/100000 he never fails me', verified_purchase: true, created_at: '2025-05-19T14:38:00.000Z' },
];

export interface Review {
  id: string;
  discord_id: string;
  username: string;
  avatar_url?: string;
  rating: number;
  content: string;
  product_name?: string;
  product_id?: number;
  verified_purchase: boolean;
  created_at: string;
}

const BLOB_PATHNAME = 'reviews.json';

export async function readReviews(): Promise<Review[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function writeReviews(reviews: Review[]): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(reviews), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}
