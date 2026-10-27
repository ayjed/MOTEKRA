import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { publishableProjects } from "@/content/models";
import { team } from "@/content/team";
import { founderDetails } from "@/content/team/profile";
import { publishableArticles } from "@/lib/data/articles";
export function approvedSeoPaths(){const offers=services.filter(service=>service.publication==='approved'),posts=publishableArticles();return ['/', '/work','/about','/contact',...(offers.length?['/services',...offers.map(service=>`/services/${service.slug}`)]:[]),...publishableProjects(projects).map(project=>`/work/${project.slug}`),...team.filter(person=>person.publication==='approved'&&founderDetails[person.slug]?.detailsPublication==='approved').map(person=>`/team/${person.slug}`),...(posts.length?['/insights',...posts.map(post=>`/insights/${post.slug}`)]:[])];}
