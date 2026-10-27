import type { Article } from "@/content/models";
import { articles } from "@/content/articles";
import { team } from "@/content/team";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { publishableProjects } from "@/content/models";
export function validEditorialDate(value:string){return /^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
export function publishableArticles(records:readonly Article[]=articles,now=new Date()) {
 const today=now.toISOString().slice(0,10);
 return records.filter(post=>post.publication==='approved'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)&&post.title.trim()&&post.summary.trim()&&post.author.verified&&post.author.name.trim()&&(!post.author.personSlug||team.some(person=>person.slug===post.author.personSlug&&person.name===post.author.name&&person.publication==='approved'))&&post.review?.approved&&post.review.name.trim()&&validEditorialDate(post.review.date)&&post.review.date<=today&&validEditorialDate(post.publishedAt)&&post.publishedAt<=today&&(!post.modifiedAt||(validEditorialDate(post.modifiedAt)&&post.modifiedAt>=post.publishedAt&&post.modifiedAt<=today))&&post.sections.length>0&&post.sections.every(section=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id)&&section.title.trim()&&section.paragraphs.length>0&&section.paragraphs.every(text=>Boolean(text.trim())))&&new Set(post.sections.map(section=>section.id)).size===post.sections.length);
}
export function articleAuthorPath(article:Article){return article.author.personSlug&&team.some(person=>person.slug===article.author.personSlug&&person.name===article.author.name&&person.publication==='approved')?`/team/${article.author.personSlug}`:null;}
export function articleRelations(article:Article){return {services:services.filter(service=>service.publication==='approved'&&article.serviceSlugs?.includes(service.slug)),projects:publishableProjects(projects).filter(project=>article.projectSlugs?.includes(project.slug))};}
