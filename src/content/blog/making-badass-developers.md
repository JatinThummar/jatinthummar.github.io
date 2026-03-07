---
title: 'Making Badass Developers: Why Getting Better Feels So Hard'
description: 'Why most developers get stuck, what science says about learning faster, and how to actually get better at programming without burning out.'
publishDate: 2026-03-07
tags: ['learning', 'productivity']
---

Someone at a party asks: "How hard can it be to become a web developer?"

Every developer in the room has a different answer. React. TypeScript. System design. Algorithms. Cloud. Docker. The list keeps growing until it falls apart, and the person who asked quietly gives up before they even started.

We've all been that person. We've also all been the one adding to the list.

---

## The wrong question

"What do I need to know?" sounds like a good place to start. It isn't.

Ask ten developers, get ten answers. Ask ten thousand, get ten thousand. There's no official list, no clear bar, no moment where you've finally learned enough. Chasing that question is how you spend years feeling like you're always behind.

The better question is: **how fast and how well can you actually learn, and still survive?**

That shift sounds small. It isn't. It moves the problem from _what's out there_ to _what's happening inside your head_. And that's where the real answer lives.

---

## One tank, not two

Here's something research has known for decades that most learning systems just ignore:

Your brain runs on a **single pool of mental energy**. The same tank that powers focused thinking, problem-solving, and learning also powers willpower, handling emotions, and making decisions. Burn one, you burn the other.

There's a famous experiment where two groups were given a memory task. One group memorized two digits, the other memorized seven. After that, both were offered fruit or cake as a snack. The seven-digit group picked way more cake. Not because they were hungrier. Because five extra digits of mental load was enough to weaken their self-control.

Five digits.

Now think about what a normal day looks like for a developer. Meetings that break your focus. An unclear ticket. A client who says "can you just do that today?" and you say "sure, no problem" while thinking something very different. Each of these is a small brain drain. On its own, nothing. Together, they empty the tank until you can't think clearly, can't learn well, and can't make progress on anything hard.

This isn't a discipline problem. It's a resource problem.

---

## Why you stop getting better

Most developers hit a wall at some point. They're practicing, they're working, they're putting in the hours, and somehow they're still stuck.

This comes down to three different problems:

### The pile-up

Too many things sitting in the "I can do this but it costs me effort" zone at once. You never fully nail anything because your mental load is spread too thin. You keep practicing being a beginner at ten things instead of getting really good at one.

Think of it like having 20 browser tabs open. Each one uses memory. At some point your machine slows to a crawl, not because any single tab is heavy, but because the total load is too much. Your brain works the same way.

### The middle plateau

You get stuck not because you stopped learning, but because something you learned a long time ago is quietly holding you back. An old habit. An old way of thinking. A shortcut that once worked. It's so automatic now that you don't even notice it.

It's like a `useEffect` with a stale closure. Everything looks right. The code runs. But it's silently using an old value, and you can't figure out why your component behaves wrong. The fix isn't to add more code. It's to go back and fix what you thought was already done.

Nobody wants to go back to something they've already "learned." But that's often exactly where the real problem is.

### It just takes too long

The usual path from "can't do it" to "I've got it" is slow and painful. Read a tutorial. Build a toy project. Struggle. Repeat. There are faster ways, and they're backed by real science.

---

## The science of getting good fast

In the 1940s, Britain needed regular people to spot incoming planes (friend or enemy) quickly and correctly. Expert plane spotters tried to teach others. They couldn't. They knew _that_ they could do it, but not _how_.

So instead of teaching, they just stood next to learners and gave feedback: yes, no, yes, no. Try after try. New expert spotters came out of this without ever being taught a single rule.

The same thing happened in Japan with chick sexers (figuring out the gender of a newborn chick, a nearly impossible visual task). Same method. Same result.

Then NASA tried this with non-pilots and flight instruments. After about two hours of this kind of practice, no teaching, just lots of good examples with feedback, non-pilots beat experienced pilots on speed and accuracy.

**Two hours.**

The brain is a pattern-matching machine. Give it enough good examples in a short time (around 200 to 300), and it starts finding patterns on its own, without you even knowing. This is called **perceptual learning**, and it works way beyond just visual tasks. It works for code, for architecture choices, for that gut feeling when you're debugging.

You already know this feeling. You look at a pull request and something feels wrong before you can say why. That's your brain showing you a pattern it picked up without telling you.

---

## What this means for how you learn to code

### Break skills smaller than you think

Here's a useful rule: if you can't take something from "can't do it" to "I've got it 95% of the time" within one to three focused sessions of under 90 minutes each, the skill is still too big. Break it down more.

Don't try to "learn React." Instead: learn how `useState` works. Then `useEffect` cleanup. Then how to lift state. Each one is a small, finishable piece. Half a skill done well beats a half-done full skill every time.

```
// Too big: "Learn state management"
// Right size:
- How does useState trigger re-renders?
- When does useEffect cleanup run?
- How do you share state between siblings?
- When do you actually need a global store?
```

### Don't spread yourself across too many things at once

The pile-up on your mental board is the single biggest reason people stop getting better. Fewer things, done really well, adds up faster than many things kept always half-done.

This is the developer version of `Promise.all` vs one-by-one `await`. It feels faster to run everything at the same time. But if each task is fighting for the same limited resource (your brain, not CPU cores), the "parallel" way actually makes things worse. You keep switching between tasks and finish nothing.

**Pick two or three things. Get really good at them. Then move on.**

### Go back to what you already know

This one is uncomfortable. But good developers regularly check their own habits. Does this pattern still help me? Is this holding me back?

Maybe you learned CSS floats before flexbox existed, and your layout thinking still carries that old approach. Maybe you reach for `useEffect` for things that should just be computed values. Maybe you write try-catch blocks around things that can't actually throw.

Being willing to pull something back from "done" and fix it is what separates people who keep growing from people who stop early.

### Read a lot of good code

Not one codebase. Not three. Hundreds. Read code from projects you like. Read it again. Watch people who are better than you work. Read their pull requests. Look at their commit history.

Your brain is doing more than you think during this. You're not just "reading code." You're training a pattern finder that will help you for years.

Some good places to start:

- **Open-source projects you actually use**: Read how React, Next.js, or Vite handle edge cases inside
- **Code review on GitHub**: Find repos with active, helpful PR discussions
- **Conference talks with live coding**: Watch how experienced developers think out loud
- **Rewriting exercises**: Take bad code and make it better, again and again, from different angles

---

## Protect the tank

The whole world around developer learning (courses, boot camps, job posts, Twitter arguments) treats you like a humanoid. Always-on brain power. Perfect memory. Straight-line learning. Never running out.

You are not a humanoid. Neither is anyone else on your team.

Your mental energy is real, it is limited, and it is worth protecting. Every pointless meeting, every unclear requirement, every badly designed tool you're forced to use is spending your most limited resource.

A few things that actually help:

- **Block focus time.** Two hours without interruption beats eight broken-up ones.
- **Write things down.** Don't use your brain as a to-do list. That's RAM wasted on storage.
- **Say no to things that drain you for nothing.** Not every meeting needs you. Not every Slack thread needs a reply.
- **Set up your space for focus.** Close tabs, mute notifications, use a separate browser profile for work.
- **Sleep.** Seriously. Your brain locks in patterns during sleep. Cutting sleep to "study more" is like deleting your build cache to "speed up" CI.

---

## The real takeaway

When you understand that your brain is a single, limited resource, two things change.

You get more careful about how you spend your own mental energy. You stop grinding through tutorials at 11 PM after a tiring workday and wondering why nothing sticks. You start breaking skills into smaller pieces, getting good at each one, and protecting the mental space that makes learning possible.

And you start thinking more about how you build things for others. Every confusing API you clean up, every clear error message you write, every well-written PR description: these aren't just "nice to have." They're saving someone's mental energy so they can spend it on something that matters.

That's not soft advice. It's how you actually get better.

---

_This post was inspired by [Kathy Sierra's](https://en.wikipedia.org/wiki/Kathy_Sierra) famous talk "Making Badass Developers." If you haven't watched it, [go watch it](https://www.youtube.com/watch?v=FKTxC9pl-WM). It changed how I think about learning._
