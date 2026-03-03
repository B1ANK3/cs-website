import { getAllEvents } from '$lib/events';
import { getAllArticles } from '$lib/articles';
import type { PageLoad } from './$types';
import { resolve } from '$app/paths';

type CarouselSlide = {
    id: string;
    type: 'event' | 'news';
    title: string;
    summary: string;
    date: string;
    mainImage: string;
    link: string;
};

function getAuthorPath(author: string): string {
    return author.toLowerCase().replace(/\s+/g, '-');
}

function shuffle<T>(items: T[]): T[] {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const temp = shuffled[index];
        shuffled[index] = shuffled[swapIndex];
        shuffled[swapIndex] = temp;
    }

    return shuffled;
}

function pickExactlyFive<T>(items: T[]): T[] {
    if (items.length === 0) {
        return [];
    }

    const shuffled = shuffle(items);
    const result: T[] = shuffled.slice(0, 5);

    let fillerIndex = 0;
    while (result.length < 5) {
        result.push(shuffled[fillerIndex % shuffled.length]);
        fillerIndex += 1;
    }

    return result;
}

export const load: PageLoad = async () => {
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const [events, articles] = await Promise.all([getAllEvents(), getAllArticles()]);

    const futureEvents = events
        .filter((event) => new Date(event.date) > now)
        .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());

    const recentNews = articles
        .filter((article) => new Date(article.date) >= threeMonthsAgo)
        .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

    const eventSlides: CarouselSlide[] = pickExactlyFive(futureEvents).map((event, index) => ({
        id: `event-${event.slug}-${index}`,
        type: 'event',
        title: event.title,
        summary: event.summary || event.description,
        date: event.date,
        mainImage: event.mainImage,
        link: resolve(`/events/${event.slug}`)
    }));

    const newsSlides: CarouselSlide[] = pickExactlyFive(recentNews).map((article, index) => ({
        id: `news-${article.slug}-${index}`,
        type: 'news',
        title: article.title,
        summary: article.summary,
        date: article.date,
        mainImage: article.mainImage,
        link: resolve(`/news/${getAuthorPath(article.author)}/${article.slug}`)
    }));

    const slides = shuffle([...eventSlides, ...newsSlides]);

    // Format articles and events for the IsometricRenderer
    const formattedArticles = recentNews.map((article) => ({
        title: article.title,
        summary: article.summary,
        url: resolve(`/news/${getAuthorPath(article.author)}/${article.slug}`),
        date: article.date
    }));

    const formattedEvents = futureEvents.map((event) => ({
        title: event.title,
        summary: event.summary || event.description,
        url: resolve(`/events/${event.slug}`),
        date: event.date
    }));

    return {
        slides,
        articles: formattedArticles,
        events: formattedEvents
    };
};
