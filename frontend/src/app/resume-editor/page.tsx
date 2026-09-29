export default function ResumeEditor() {
  return (
    <div style={{display: 'grid', gridTemplateColumns: '250px 1fr', height: '100vh'}}>
      <div style={{borderRight: '1px solid #ccc', padding: '1rem'}}>
        <h3>Resume Sections</h3>
        <ul>
          <li>Summary</li>
          <li>Experience</li>
          <li>Education</li>
          <li>Skills</li>
          <li>Projects</li>
        </ul>
      </div>
      <div style={{padding: '1rem'}}>
        <h2>Live Preview</h2>
        <div style={{border: '1px solid #eee', padding: '1rem', minHeight: '400px'}}>
          Resume Preview
        </div>
      </div>
    </div>
  );
}
