import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { useProjects } from "../hooks/useProjects";
import { FlaskConical, Plus, ArrowRight, Clock, Trash2, Star, Archive, Edit3, Bookmark, BookmarkCheck } from "lucide-react";

export function Dashboard() {
  const { projects, deleteProject, updateProject } = useProjects();
  const [projectToDelete, setProjectToDelete] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeTab, setActiveTab] = useState('all');
  
  const ITEMS_PER_PAGE = 6;
  
  const filteredProjects = React.useMemo(() => {
    switch(activeTab) {
      case 'drafts': return projects.filter((p) => p.isDraft);
      case 'favorites': return projects.filter((p) => p.isFavorite);
      case 'archived': return projects.filter((p) => p.isArchived);
      default: return projects.filter((p) => !p.isArchived);
    }
  }, [projects, activeTab]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 w-full max-w-7xl mx-auto px-4 py-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and continue building your ideas.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/export">
            <Button variant="outline" className="gap-2">
              Export Center
            </Button>
          </Link>
          <Link to="/new">
            <Button className="gap-2">
              <Plus size={18} />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 border-b border-surface-border mb-8 gap-6 scrollbar-hide">
        <button 
          onClick={() => { setActiveTab('all'); setCurrentPage(1); }} 
          className={`pb-2 whitespace-nowrap text-sm font-medium transition-colors border-b-2 ${activeTab === 'all' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          All Projects
        </button>
        <button 
          onClick={() => { setActiveTab('drafts'); setCurrentPage(1); }} 
          className={`pb-2 whitespace-nowrap text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${activeTab === 'drafts' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Edit3 size={14} /> Drafts
        </button>
        <button 
          onClick={() => { setActiveTab('favorites'); setCurrentPage(1); }} 
          className={`pb-2 whitespace-nowrap text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${activeTab === 'favorites' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Star size={14} /> Favorites
        </button>
        <button 
          onClick={() => { setActiveTab('archived'); setCurrentPage(1); }} 
          className={`pb-2 whitespace-nowrap text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${activeTab === 'archived' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Archive size={14} /> Archived
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-surface border border-surface-border rounded-3xl border-dashed">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <FlaskConical size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground max-w-md mb-8">
            {activeTab === 'all' ? "You haven't created any projects yet." : `You don't have any projects in ${activeTab}.`}
          </p>
          {activeTab === 'all' && (
            <Link to="/new">
              <Button>Start Building</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <Card key={project.id} className="flex flex-col transition-all hover:shadow-md hover:border-primary/30">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="inline-flex items-center rounded-full bg-surface-hover px-2.5 py-0.5 text-xs font-semibold text-muted-foreground mb-3">
                      {project.idea.category || "General"}
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          updateProject(project.id, { isFavorite: !project.isFavorite });
                        }}
                        className={`hover:text-yellow-500 transition-colors p-1 ${project.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
                        title={project.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star size={16} fill={project.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          updateProject(project.id, { isArchived: !project.isArchived });
                        }}
                        className={`hover:text-primary transition-colors p-1 ${project.isArchived ? 'text-primary' : 'text-muted-foreground'}`}
                        title={project.isArchived ? "Unarchive project" : "Archive project"}
                      >
                        <Archive size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setProjectToDelete(project.id);
                        }}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        title="Delete project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight line-clamp-2" title={project.output.title}>
                    {project.output.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <Clock size={14} />
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-foreground line-clamp-3">
                    {project.output.pitch || project.output.problem_statement}
                  </p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link to={`/project/${project.id}`}>
                    <Button variant="outline" className="w-full gap-2 group">
                      Open Project
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface border border-surface-border rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-semibold mb-2">Delete Project</h2>
            <p className="text-muted-foreground mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setProjectToDelete(null)}>Cancel</Button>
              <Button variant="success" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => {
                deleteProject(projectToDelete);
                setProjectToDelete(null);
              }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
