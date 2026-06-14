import { NextRequest, NextResponse } from 'next/server';
import { writeReviews, readReviews, Review } from '@/lib/reviews';

export const dynamic = 'force-dynamic';

type SeedEntry = Omit<Review, 'id'>;

const SEED_REVIEWS: SeedEntry[] = [
  { discord_id: 'seed001', username: 'ImJustTeejayyll', rating: 5, content: 'good and fast services im talking everything yu need highly recommend ‼️🔥', verified_purchase: true, created_at: '2025-10-22T23:08:00.000Z' },
  { discord_id: 'seed002', username: 'WAR', rating: 5, content: "I've been buying scripts from Flake since I first started my server, and every single one has been straight 🔥. Flake recently presented an opportunity for the GW-inspired base, and me and my partner jumped on it right away. Between the open-source scripts and the custom ones he's built personally, the quality and attention to detail speak for themselves. I've seen the hours he puts in to perfect his work — dude's dedicated. Flake is a one-stop shop for anything you need to elevate your FiveM server. Can't recommend him enough. 💯", verified_purchase: true, created_at: '2025-10-24T10:30:00.000Z' },
  { discord_id: 'seed003', username: '⭒', rating: 5, content: 'flake is solid. all scripts i have installed in my server seamless and clean even when i was just starting they were straight to the point. 10/10', verified_purchase: true, created_at: '2025-10-29T19:46:00.000Z' },
  { discord_id: 'seed004', username: 'Aj', rating: 5, content: '10/10 good and fast🐐', verified_purchase: true, created_at: '2025-11-02T15:54:00.000Z' },
  { discord_id: 'seed005', username: 'TextRead', rating: 5, content: '10/10 Got me right', verified_purchase: true, created_at: '2025-11-03T22:00:00.000Z' },
  { discord_id: 'seed006', username: 'Loso143', rating: 5, content: '10/10 🔥 🔥', verified_purchase: true, created_at: '2025-11-04T11:56:00.000Z' },
  { discord_id: 'seed007', username: 'LoyalFamKash', rating: 5, content: '10/10 fire ass scripts', verified_purchase: true, created_at: '2025-11-05T14:20:00.000Z' },
  { discord_id: 'seed008', username: 'HDJONTV', rating: 5, content: '10/10 Got me right', verified_purchase: true, created_at: '2025-11-05T20:21:00.000Z' },
  { discord_id: 'seed009', username: 'H2', rating: 5, content: 'Fast service as always', verified_purchase: true, created_at: '2025-11-06T12:06:00.000Z' },
  { discord_id: 'seed010', username: 'noface.', rating: 5, content: "Flake is more than quick service, gives you reassurance every minute in the ticket. He doesn't just take your money and go offline — once you send money he sends you the product. 10/10, fuck that 10000/10", verified_purchase: true, created_at: '2025-11-08T22:07:00.000Z' },
  { discord_id: 'seed011', username: 'SlapzThaDon', rating: 5, content: '1000/10 Service 💯💯💯 fast customer service and goes above and beyond to make sure you get what you need help with. Def gonna continue shopping here!!', verified_purchase: true, created_at: '2025-11-08T22:23:00.000Z' },
  { discord_id: 'seed012', username: 'MrWicsTV', rating: 5, content: '100000000/10... was frustrated getting a script config but Flake made sure the mission was complete ✅ before closing the ticket 💯 will be returning for more scripts fashooo', verified_purchase: true, created_at: '2025-11-15T00:25:00.000Z' },
  { discord_id: 'seed013', username: 'Jaqyn', rating: 5, content: 'That grizzly world base so fye, Flake did his thing with every script 💯, no waiting no gimmicks. If you\'re looking to get it don\'t hesitate. Money well spent 💯‼️ ⭐️⭐️⭐️⭐️ 5 star service wtf is the yelp page', verified_purchase: true, created_at: '2025-11-15T15:08:00.000Z' },
  { discord_id: 'seed014', username: 'AlonzoHarris', rating: 5, content: 'Best fivem Base on the market and the scripts work better than the originals ⭐ ⭐ ⭐ ⭐ ⭐ 10stars all around no cap. Everything is drag and drop', verified_purchase: true, created_at: '2025-11-16T21:17:00.000Z' },
  { discord_id: 'seed015', username: 'Fancy', rating: 5, content: '10/10 fast support 💯', verified_purchase: true, created_at: '2025-11-17T10:41:00.000Z' },
  { discord_id: 'seed016', username: 'JUNECBFW', rating: 5, content: '10/10 got to me fast', verified_purchase: true, created_at: '2025-11-26T16:25:00.000Z' },
  { discord_id: 'seed017', username: 'L.A.Y.L.A', rating: 5, content: '1000/10 thank you so much for my custom teleport! i love it 😊', verified_purchase: true, created_at: '2025-12-01T14:55:00.000Z' },
  { discord_id: 'seed018', username: 'breezyhimself', rating: 5, content: 'MY DUDE HAS THE BESTTTT CROSSHAIR IVE EVER USED IN A CITY', verified_purchase: true, created_at: '2026-01-08T20:37:00.000Z' },
  { discord_id: 'seed019', username: 'Yungestsmacca', rating: 5, content: '10/10 SERVICE QUICK AND FAST GONE GET YOU RIGHT BEST OUT', verified_purchase: true, created_at: '2026-01-11T14:44:00.000Z' },
  { discord_id: 'seed020', username: 'Josiah', rating: 5, content: 'shout out to Flake manee', verified_purchase: true, created_at: '2026-01-13T15:18:00.000Z' },
  { discord_id: 'seed021', username: 'Vxtone', rating: 5, content: 'this mf move fast as hell ngl, best customer service!! 10/10 highly recommend!!', verified_purchase: true, created_at: '2026-01-30T15:57:00.000Z' },
  { discord_id: 'seed022', username: 'Aron', rating: 5, content: 'W scripts 10/10 🤙🏼', verified_purchase: true, created_at: '2026-02-15T21:01:00.000Z' },
  { discord_id: 'seed023', username: 'ARS3LL', rating: 5, content: 'Quicc response and good service.', verified_purchase: true, created_at: '2026-04-16T20:26:00.000Z' },
  { discord_id: 'seed024', username: 'KING', rating: 5, content: 'If you got Flake you need no one else. Quick, fast, and very efficient, 10/10.', verified_purchase: true, created_at: '2026-05-04T07:51:00.000Z' },
  { discord_id: 'seed025', username: 'H', rating: 5, content: "10/10 good services highly recommend don't miss out 🔥", verified_purchase: true, created_at: '2026-05-05T12:09:00.000Z' },
  { discord_id: 'seed026', username: 'H', rating: 5, content: 'Came back in got me right very professional 🔥', verified_purchase: true, created_at: '2026-05-08T19:51:00.000Z' },
  { discord_id: 'seed027', username: 'Unknown', rating: 5, content: 'Flake 100%. Fast with the response and the service.', verified_purchase: true, created_at: '2026-05-09T16:12:00.000Z' },
  { discord_id: 'seed028', username: 'H', rating: 5, content: 'Fire cooking script get yours no regrets 🔥🔥🔥 10/10 must recommend', verified_purchase: true, created_at: '2026-05-15T20:39:00.000Z' },
  { discord_id: 'seed029', username: 'LoyalFamKash', rating: 5, content: 'Flake 100%. Fast with the response get me right everytime', verified_purchase: true, created_at: '2026-05-24T12:03:00.000Z' },
  { discord_id: 'seed030', username: 'MvpSquad', rating: 5, content: 'Appreciate the quick responds and helping me out, if you had a rate system ill rate it 100%... Keep up the good work', verified_purchase: true, created_at: '2025-10-12T22:45:00.000Z' },
  { discord_id: 'seed031', username: 'H2', rating: 5, content: 'Plug Script is nice! Thanx bro I appreciate the quick process!', verified_purchase: true, created_at: '2025-05-09T20:41:00.000Z' },
  { discord_id: 'seed032', username: 'H2', rating: 5, content: 'Another fire script! Physical therapy! no issues! Appreciate it!', verified_purchase: true, created_at: '2025-05-12T03:46:00.000Z' },
  { discord_id: 'seed033', username: 'H2', rating: 5, content: 'Blackmarket script is 💯! 3 scripts for 50% is a crazy deal, Goodlooking', verified_purchase: true, created_at: '2025-05-16T19:42:00.000Z' },
  { discord_id: 'seed034', username: 'H2', rating: 5, content: 'Just installed busttop in our server. Another W!!!', verified_purchase: true, created_at: '2025-05-17T13:01:00.000Z' },
  { discord_id: 'seed035', username: 'Kenzo14', rating: 5, content: 'the best 1000/100000 he never fails me', verified_purchase: true, created_at: '2025-05-19T14:38:00.000Z' },
  { discord_id: 'seed036', username: 'cdotalt', rating: 5, content: 'he js too teed 100000%', verified_purchase: true, created_at: '2025-05-19T19:26:00.000Z' },
  { discord_id: 'seed037', username: 'SMILEY', rating: 5, content: 'Best Service Hands Down 💯', verified_purchase: true, created_at: '2025-05-20T02:27:00.000Z' },
  { discord_id: 'seed038', username: 'L.A.Y.L.A', rating: 5, content: '10/10 best service 💗', verified_purchase: true, created_at: '2025-05-20T16:19:00.000Z' },
  { discord_id: 'seed039', username: 'SMILEY', rating: 5, content: 'just brought another script got 5 scripts all together from bro best service without question 💯🤝🏾', verified_purchase: true, created_at: '2025-05-21T02:22:00.000Z' },
  { discord_id: 'seed040', username: 'buckwi1d730', rating: 5, content: "Fastest Service I've ever had getting scripts. I will be back!!", verified_purchase: true, created_at: '2025-05-23T18:48:00.000Z' },
  { discord_id: 'seed041', username: '⭒', rating: 5, content: 'solid store fast an reliable! very helpful 100/100', verified_purchase: true, created_at: '2025-05-25T13:16:00.000Z' },
  { discord_id: 'seed042', username: 'H2', rating: 5, content: 'Let s goooo! Flake 💯 Fast and taught me some valuable info', verified_purchase: true, created_at: '2025-05-27T00:35:00.000Z' },
  { discord_id: 'seed043', username: 'mdosha', rating: 5, content: 'trust worthy and honest service reliable fast and quick responding, always willing to help with little questions.', verified_purchase: true, created_at: '2025-06-05T20:05:00.000Z' },
  { discord_id: 'seed044', username: 'HDJONTV', rating: 5, content: '10/10 best service i will be getting more scripts', verified_purchase: true, created_at: '2025-06-13T23:10:00.000Z' },
  { discord_id: 'seed045', username: 'Hitman', rating: 5, content: '10/10 💯', verified_purchase: true, created_at: '2025-06-15T10:21:00.000Z' },
];

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';

  const existing = await readReviews();
  if (existing.length > 0 && !force) {
    return NextResponse.json({
      message: `Already seeded with ${existing.length} reviews. Use ?force=true to overwrite.`,
      count: existing.length,
    });
  }

  const base = Date.now() - SEED_REVIEWS.length * 1000;
  const reviews: Review[] = SEED_REVIEWS.map((r, i) => ({
    ...r,
    id: (base + i * 1000).toString(36),
  }));

  await writeReviews(reviews);
  return NextResponse.json({ seeded: reviews.length, ids: reviews.map(r => ({ id: r.id, username: r.username })) }, { status: 201 });
}
