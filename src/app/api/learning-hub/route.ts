import { getGithubFile, updateGithubFile, jsonNoCache } from '@/lib/github';
import { LearningHubData, LearningResource, Workshop, LearnerShowcase, PracticalProject } from '@/lib/learning-hub-types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const LEARNING_HUB_PATH = 'public/data/learning-hub.json';

function safeParseData(content?: string): LearningHubData {
  if (!content) {
    return {
      paths: [],
      resources: [],
      workshops: [],
      projects: [],
      learnerShowcase: [],
      externalKnowledgeSites: [],
    };
  }
  try {
    const data = JSON.parse(content);
    return {
      paths: Array.isArray(data.paths) ? data.paths : [],
      resources: Array.isArray(data.resources) ? data.resources : [],
      workshops: Array.isArray(data.workshops) ? data.workshops : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      learnerShowcase: Array.isArray(data.learnerShowcase) ? data.learnerShowcase : [],
      externalKnowledgeSites: Array.isArray(data.externalKnowledgeSites) ? data.externalKnowledgeSites : [],
    };
  } catch (e) {
    console.error('Failed to parse learning hub JSON:', e);
    return {
      paths: [],
      resources: [],
      workshops: [],
      projects: [],
      learnerShowcase: [],
      externalKnowledgeSites: [],
    };
  }
}

export async function GET() {
  try {
    const file = await getGithubFile(LEARNING_HUB_PATH);
    if (!file) {
      return jsonNoCache({
        paths: [],
        resources: [],
        workshops: [],
        projects: [],
        learnerShowcase: [],
        externalKnowledgeSites: [],
      });
    }
    const data = safeParseData(file.content);
    return jsonNoCache(data);
  } catch (error: any) {
    console.error('Error reading learning hub data:', error);
    return jsonNoCache({ error: error?.message || 'Failed to load learning hub data' }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const file = await getGithubFile(LEARNING_HUB_PATH);
    const data = safeParseData(file?.content);
    const currentSha = file ? file.sha : undefined;

    // Handle Multipart Form Data (e.g. file uploads for resources)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const entityType = formData.get('entityType') as string; // 'resource' | 'workshop'

      if (entityType === 'resource') {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = (formData.get('category') as any) || 'General';
        const type = (formData.get('type') as any) || 'notes';
        const access = (formData.get('access') as any) || 'Free';
        const format = formData.get('format') as string || 'PDF';
        const topic = formData.get('topic') as string || 'General';
        const platform = (formData.get('platform') as any) || 'Local Download';
        const externalUrl = formData.get('externalUrl') as string || '';
        const tagsRaw = formData.get('tags') as string || '';
        const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);
        const fileUpload = formData.get('file') as File | null;

        if (!title || !description) {
          return jsonNoCache({ error: 'Title and description are required' }, 400);
        }

        let fileUrl: string | undefined = undefined;
        let fileSize: string | undefined = undefined;

        if (fileUpload && fileUpload.name) {
          const bytes = await fileUpload.arrayBuffer();
          const base64Content = Buffer.from(bytes).toString('base64');
          const cleanName = fileUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileName = `${Date.now()}-${cleanName}`;
          const uploadPath = `public/uploads/learning-hub/${fileName}`;

          await updateGithubFile(uploadPath, base64Content, `Upload learning resource file ${fileName}`);
          fileUrl = `/uploads/learning-hub/${fileName}`;

          // Approximate size
          const sizeKb = Math.round(fileUpload.size / 1024);
          fileSize = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
        }

        const newResource: LearningResource = {
          id: `res-${Date.now()}`,
          title,
          description,
          category,
          type,
          access,
          format,
          fileSize: fileSize || (externalUrl ? 'Online Link' : 'N/A'),
          downloadUrl: fileUrl || externalUrl || '#',
          externalUrl: externalUrl || undefined,
          fileUrl,
          platform,
          topic,
          tags,
          dateAdded: new Date().toISOString().split('T')[0],
        };

        data.resources.unshift(newResource);

        const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
        await updateGithubFile(LEARNING_HUB_PATH, newContent, `Add learning resource: ${title}`, currentSha);

        return jsonNoCache({ success: true, resource: newResource }, 201);
      }

      if (entityType === 'workshop') {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const date = formData.get('date') as string || new Date().toISOString().split('T')[0];
        const time = formData.get('time') as string || '14:00 - 16:00 EAT';
        const format = (formData.get('format') as 'Online' | 'Physical') || 'Online';
        const location = formData.get('location') as string || (format === 'Online' ? 'Google Meet' : 'Campus Lab');
        const meetUrl = formData.get('meetUrl') as string || '';
        const recordingUrl = formData.get('recordingUrl') as string || '';
        const status = (formData.get('status') as 'upcoming' | 'completed') || 'upcoming';
        const access = (formData.get('access') as any) || 'Free';
        const targetAudience = formData.get('targetAudience') as string || 'Students & Coursemates';
        const objectivesRaw = formData.get('objectives') as string || '';
        const objectives = objectivesRaw.split('\n').map((o) => o.trim()).filter(Boolean);
        const highlightRecap = formData.get('highlightRecap') as string || '';

        if (!title || !description) {
          return jsonNoCache({ error: 'Workshop title and description are required' }, 400);
        }

        const newWorkshop: Workshop = {
          id: `ws-${Date.now()}`,
          title,
          description,
          date,
          time,
          format,
          location,
          meetUrl: meetUrl || undefined,
          recordingUrl: recordingUrl || undefined,
          status,
          objectives: objectives.length > 0 ? objectives : ['Hands-on practical walkthrough', 'Q&A session with Brian'],
          targetAudience,
          registrationOpen: status === 'upcoming',
          registrationLink: meetUrl || '#register',
          access,
          highlightRecap: highlightRecap || undefined,
        };

        data.workshops.unshift(newWorkshop);

        const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
        await updateGithubFile(LEARNING_HUB_PATH, newContent, `Add workshop: ${title}`, currentSha);

        return jsonNoCache({ success: true, workshop: newWorkshop }, 201);
      }

      if (entityType === 'showcase' || entityType === 'learnerShowcase') {
        const learnerName = formData.get('learnerName') as string;
        const role = (formData.get('role') as string) || 'Coursemate / Data Trainee';
        const cohort = (formData.get('cohort') as string) || 'Cohort 2024';
        const projectTitle = formData.get('projectTitle') as string;
        const description = formData.get('description') as string;
        const technologiesRaw = (formData.get('technologies') as string) || '';
        const technologies = technologiesRaw.split(',').map((t) => t.trim()).filter(Boolean);
        const githubUrl = (formData.get('githubUrl') as string) || '';
        const liveUrl = (formData.get('liveUrl') as string) || '';
        const quote = (formData.get('quote') as string) || '';
        const publishedWithConsent = formData.get('publishedWithConsent') === 'true' || formData.get('publishedWithConsent') === 'on';
        const imageFile = formData.get('image') as File | null;

        if (!learnerName || !projectTitle || !description) {
          return jsonNoCache({ error: 'Learner name, project title, and description are required' }, 400);
        }

        let imagePath = '/assets/project-placeholder.svg';
        if (imageFile && imageFile.name) {
          const bytes = await imageFile.arrayBuffer();
          const base64Content = Buffer.from(bytes).toString('base64');
          const cleanName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileName = `${Date.now()}-${cleanName}`;
          const uploadPath = `public/uploads/learning-hub/${fileName}`;

          await updateGithubFile(uploadPath, base64Content, `Upload learner showcase image ${fileName}`);
          imagePath = `/uploads/learning-hub/${fileName}`;
        }

        const newShowcase: LearnerShowcase = {
          id: `showcase-${Date.now()}`,
          learnerName,
          role,
          cohort,
          projectTitle,
          description,
          technologies: technologies.length > 0 ? technologies : ['Python', 'Pandas'],
          githubUrl: githubUrl || undefined,
          liveUrl: liveUrl || undefined,
          quote: quote || 'Learned practical data manipulation and problem solving under Brian’s guidance.',
          publishedWithConsent,
          image: imagePath,
        };

        data.learnerShowcase.unshift(newShowcase);

        const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
        await updateGithubFile(LEARNING_HUB_PATH, newContent, `Add learner showcase: ${projectTitle}`, currentSha);

        return jsonNoCache({ success: true, showcase: newShowcase }, 201);
      }

      if (entityType === 'project' || entityType === 'practicalProject') {
        const title = formData.get('title') as string;
        const category = ((formData.get('category') as any) || 'Data Analysis') as 'Data Analysis' | 'Data Science';
        const difficulty = ((formData.get('difficulty') as any) || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced';
        const access = ((formData.get('access') as any) || 'Free') as any;
        const problemStatement = formData.get('problemStatement') as string;
        const datasetName = (formData.get('datasetName') as string) || 'Curated Dataset';
        const datasetDescription = (formData.get('datasetDescription') as string) || '';
        const datasetUrl = (formData.get('datasetUrl') as string) || '';
        const datasetSize = (formData.get('datasetSize') as string) || '';
        const technologiesRaw = (formData.get('technologies') as string) || '';
        const technologies = technologiesRaw.split(',').map((t) => t.trim()).filter(Boolean);
        const instructionsRaw = (formData.get('stepByStepInstructions') as string) || '';
        const stepByStepInstructions = instructionsRaw.split('\n').map((s) => s.trim()).filter(Boolean);
        const outputRaw = (formData.get('expectedOutput') as string) || '';
        const expectedOutput = outputRaw.split('\n').map((o) => o.trim()).filter(Boolean);
        const githubUrl = (formData.get('githubUrl') as string) || '';
        const resourceLink = (formData.get('resourceLink') as string) || '';

        if (!title || !problemStatement) {
          return jsonNoCache({ error: 'Project title and problem statement are required' }, 400);
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const newProject: PracticalProject = {
          id: `proj-${Date.now()}`,
          slug: slug || `project-${Date.now()}`,
          title,
          category,
          difficulty,
          access,
          problemStatement,
          datasetName,
          datasetDescription,
          datasetUrl: datasetUrl || undefined,
          datasetSize: datasetSize || undefined,
          technologies: technologies.length > 0 ? technologies : ['Python', 'Pandas'],
          stepByStepInstructions:
            stepByStepInstructions.length > 0
              ? stepByStepInstructions
              : ['Clone repository starter files', 'Load and clean raw dataset', 'Generate EDA visualizations', 'Produce final markdown findings'],
          expectedOutput:
            expectedOutput.length > 0
              ? expectedOutput
              : ['Cleaned dataset CSV', 'Jupyter notebook with EDA charts', 'Executive summary insights'],
          githubUrl: githubUrl || undefined,
          resourceLink: resourceLink || undefined,
        };

        data.projects.unshift(newProject);

        const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
        await updateGithubFile(LEARNING_HUB_PATH, newContent, `Add practical project: ${title}`, currentSha);

        return jsonNoCache({ success: true, project: newProject }, 201);
      }
    }

    // Handle direct JSON payload
    const body = await request.json();
    const updatedData = {
      ...data,
      ...body,
    };

    const newContent = Buffer.from(JSON.stringify(updatedData, null, 2)).toString('base64');
    await updateGithubFile(LEARNING_HUB_PATH, newContent, 'Update Learning Hub content', currentSha);

    return jsonNoCache({ success: true, data: updatedData }, 200);
  } catch (error: any) {
    console.error('Error in POST /api/learning-hub:', error);
    return jsonNoCache({ error: error?.message || 'Failed to save learning hub content' }, 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, type } = await request.json();
    if (!id || !type) {
      return jsonNoCache({ error: 'Missing id or entity type' }, 400);
    }

    const file = await getGithubFile(LEARNING_HUB_PATH);
    const data = safeParseData(file?.content);
    const currentSha = file ? file.sha : undefined;

    if (type === 'resource') {
      data.resources = data.resources.filter((r) => r.id !== id);
    } else if (type === 'workshop') {
      data.workshops = data.workshops.filter((w) => w.id !== id);
    } else if (type === 'project') {
      data.projects = data.projects.filter((p) => p.id !== id);
    } else if (type === 'learnerShowcase') {
      data.learnerShowcase = data.learnerShowcase.filter((l) => l.id !== id);
    }

    const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    await updateGithubFile(LEARNING_HUB_PATH, newContent, `Delete ${type} with id ${id}`, currentSha);

    return jsonNoCache({ success: true }, 200);
  } catch (error: any) {
    console.error('Error in DELETE /api/learning-hub:', error);
    return jsonNoCache({ error: error?.message || 'Failed to delete item' }, 500);
  }
}
