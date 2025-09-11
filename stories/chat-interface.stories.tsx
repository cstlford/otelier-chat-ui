import type { Meta, StoryObj } from "@storybook/react-vite";
import Othelia from "../src/othelia";

const meta = {
  title: "Example/Othelia",
  component: Othelia,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `

<p>An interactive chat platform</p>
<hr/>

<h3>System Architecture</h3>
<div style="display:flex; gap:2rem; align-items:flex-start;">
  <img src="src/assets/diagram.png" style="width:400px; border:1px solid #ccc; border-radius:8px;" />
  <div>
    <h4>React UI</h4>
    <ul>
      <li>Developer-friendly npm module</li>
      <li>Application and User aware</li>
    </ul>
    <h4>.NET API</h4>
    <ul>
      <li>Handles authentication/authorization</li>
      <li>Org- and user-specific data access controls</li>
    </ul>
    <h4>Python FastAPI Backend</h4>
    <ul>
      <li>Langgraph-powered configurable agentic workflows</li>
      <li>Secure database connections with vector schema storage</li>
    </ul>
    <h4>Data Warehouse</h4>
    <ul>
      <li>Read-only Snowflake access for secure analytics</li>
      <li>Org-specific insights and reporting</li>
    </ul>
  </div>
</div>

<hr/>

<h3>Agent Flow</h3>
<div style="display:flex; gap:2rem; align-items:flex-start;">
  <img src="src/assets/workflow.png" style="width:400px; border:1px solid #ccc; border-radius:8px;" />
  <div>
    <h4>Multi-Agent Architecture</h4>
    <ul>
      <li>Supervisor delegates tasks to specialized subagents, compiles responses</li>
      <li><b>SQL Agent</b>: Generates/validates queries with schema retrieval + execution</li>
      <li><b>Analysis Agent</b>: Fetches data, performs calculations, creates visualizations via code interpreter + web search</li>
      <li><b>Benefits</b>: Modular, extensible, efficient processing</li>
    </ul>
  </div>
</div>
<div style="margin-top:1rem; font-style:italic; color:#666;">
  <h4>Demo Questions</h4>
  <ul>
      <li>What's my total revenue booked for the next three months, broken down by month?</li>
      <li>What are my top 5 most cancelled dates in the next 3 months for bookings cancelled in the last 7 days? Are there any eternal factors that could be linked to these?</li>
  </ul>
</div>
      `,
      },
    },
  },
} satisfies Meta<typeof Othelia>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    url: "http://localhost:8000",
    application: {
      name: "IntelliSight",
      description:
        "Centralize data across your hospitality enterprise and rely on automated reports and dynamic visualizations to help you run a smarter hospitality business.",
    },
    organizationId: 38,
    jwt: "example-jwt-token",
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        height: "700px",
        background: "#232323ff",
        padding: "1rem",
      }}
    >
      <Othelia {...args} />
    </div>
  ),
};
