// GET {{host}}/projects/{{projId1}}
const project = {
  id: "f0a610ab-bc18-4b41-bee0-dac694dc4473",
  createdAt: "2019-05-28T03:44:03.349+0000",
  updatedAt: "2019-05-28T03:44:03.349+0000",
  updatedBy: null,
  title: "Alter my Google maps history",
  description:
    "I need someone, if it is possible, to change and add some activity in my Google maps history on a certain date. I don't know if you can essentially go back in time on the app and add or change things on it or if I can change the date on my phone so that when I go somewhere today it looks like it was on that date but I would love some help or ideas. Willing to pay well",
  budget: "250.00 – 750.00 USD",
  status: "open",
  genContractor: {
    id: "f931c431-e239-43c0-a936-258930823486",
    createdAt: "2019-05-27T03:56:05.217+0000",
    updatedAt: "2019-05-27T03:56:05.217+0000",
    updatedBy: null,
    email: "abc@a.com",
    status: "PENDING",
    statusReason: null,
    address: null,
    contractorFiles: [],
    contractorSpecialties: []
  },
  projectFiles: [],
  projectTemplates: [
    {
      id: "22fa210f-85ee-40c2-af98-340e2548ec46",
      createdAt: "2019-05-28T03:44:39.298+0000",
      updatedAt: "2019-05-28T03:44:39.298+0000",
      updatedBy: null,
      template: {
        id: "32c07645-a30a-41b6-8bac-1b4b387626d9",
        createdAt: "2019-05-28T03:44:23.367+0000",
        updatedAt: "2019-05-28T03:44:23.367+0000",
        updatedBy: null,
        name: "template1",
        description: "temp1 desc",
        categoryList: [
          {
            id: "1d819c10-2223-4832-bdce-dad6b571ae82",
            createdAt: "2019-05-28T03:44:52.423+0000",
            updatedAt: "2019-05-28T03:44:52.423+0000",
            updatedBy: null,
            name: "cat 2",
            type: "design",
            value: "design_02",
            description: "desc 2",
            optionList: [],
            proposalOptions: null
          },
          {
            id: "c277b423-7323-437e-a6be-592d20165444",
            createdAt: "2019-05-28T03:44:49.887+0000",
            updatedAt: "2019-05-28T03:44:49.887+0000",
            updatedBy: null,
            name: "cat 1",
            type: "design",
            value: "design_01",
            description: "desc 1",
            optionList: [],
            proposalOptions: null
          }
        ],
        projectTemplates: null
      }
    },
    {
      id: "0369c0d1-83ac-457d-aefe-1f032928dddd",
      createdAt: "2019-05-28T03:44:41.445+0000",
      updatedAt: "2019-05-28T03:44:41.445+0000",
      updatedBy: null,
      template: {
        id: "d48f985e-36c7-411c-8f9f-96a6e1cd79e2",
        createdAt: "2019-05-28T03:44:36.382+0000",
        updatedAt: "2019-05-28T03:44:36.382+0000",
        updatedBy: null,
        name: "template2",
        description: "temp2 desc",
        categoryList: [],
        projectTemplates: null
      }
    }
  ],
  projectSpecialties: []
};

// POST {{host}}/proposals/{{proposalId1}}/categories/{{cat1}}/options
const body = {
  name: "opt1",
  description: "desc11",
  value: "value1",
  budget: "100",
  duration: "10"
};

// GET {{host}}/proposals/{{proposalId1}}/temCatOptionDetail
const details = {
  proposal: {
    id: "85bdb2e2-8d16-4ab1-b119-096a7f09a4b5",
    createdAt: "2019-05-27T05:33:29.828+0000",
    updatedAt: "2019-05-27T05:33:29.828+0000",
    updatedBy: null,
    description: "some desc",
    budget: 100,
    status: "SUBMITTED",
    duration: 10,
    project: {
      id: "09b00176-54a1-4a40-9ceb-bbc026ed8f11",
      createdAt: "2019-05-27T02:45:58.158+0000",
      updatedAt: "2019-05-27T02:46:02.724+0000",
      updatedBy: null,
      title: "project1 new",
      description: "desc new",
      budget: 10000,
      status: null,
      genContractor: {
        id: "e26ab1b5-c1e7-43e7-8458-606f28b113dc",
        createdAt: "2019-05-27T02:45:50.429+0000",
        updatedAt: "2019-05-27T02:45:53.459+0000",
        updatedBy: null,
        email: "abc@a.com",
        status: "ACTIVE",
        statusReason: null,
        address: {
          id: "01814c32-538b-4d75-b0d2-a3d664e0f6fb",
          createdAt: "2019-05-27T02:45:52.060+0000",
          updatedAt: "2019-05-27T02:45:53.460+0000",
          updatedBy: null,
          name: "gen1 new",
          street: "123 dbc",
          city: "ad",
          phone: "32322"
        },
        contractorFiles: [],
        contractorSpecialties: []
      },
      projectFiles: [],
      projectTemplates: [
        {
          id: "cb2d3d8c-1661-4784-b9a9-1d79277da0fb",
          createdAt: "2019-05-27T03:16:01.486+0000",
          updatedAt: "2019-05-27T03:16:01.486+0000",
          updatedBy: null,
          template: {
            id: "ea7216d2-8e47-45d9-8fdb-ca6dc631bc75",
            createdAt: "2019-05-27T03:15:29.857+0000",
            updatedAt: "2019-05-27T03:15:29.857+0000",
            updatedBy: null,
            name: "template1",
            description: "temp1 desc",
            categoryList: [
              {
                id: "00a454c7-4190-4b00-bc08-151560baad74",
                createdAt: "2019-05-27T03:15:36.100+0000",
                updatedAt: "2019-05-27T03:15:36.100+0000",
                updatedBy: null,
                name: "cat 2",
                type: "design",
                value: "design_02",
                description: "desc 2",
                optionList: [],
                proposalOptions: null
              },
              {
                id: "325041a0-8287-4ba6-a0fe-5a2944c0580e",
                createdAt: "2019-05-27T03:15:33.331+0000",
                updatedAt: "2019-05-27T03:15:33.331+0000",
                updatedBy: null,
                name: "cat 1",
                type: "design",
                value: "design_01",
                description: "desc 1",
                optionList: [],
                proposalOptions: null
              },
              {
                id: "1260ace6-fb93-47c9-9f06-40a4721ef450",
                createdAt: "2019-05-27T03:22:20.222+0000",
                updatedAt: "2019-05-27T03:22:20.222+0000",
                updatedBy: null,
                name: "cat 2",
                type: "design",
                value: "design_02",
                description: "desc 2",
                optionList: [],
                proposalOptions: null
              },
              {
                id: "107aed60-42b5-4437-904e-7e95d560d88b",
                createdAt: "2019-05-27T03:22:10.927+0000",
                updatedAt: "2019-05-27T03:22:10.927+0000",
                updatedBy: null,
                name: "cat 1",
                type: "design",
                value: "design_01",
                description: "desc 1",
                optionList: [],
                proposalOptions: null
              }
            ],
            projectTemplates: null
          }
        },
        {
          id: "c45559ab-0e75-4990-94a3-aa2103e992cb",
          createdAt: "2019-05-27T02:48:57.002+0000",
          updatedAt: "2019-05-27T02:48:57.002+0000",
          updatedBy: null,
          template: {
            id: "4f4ace9e-1f78-43cf-b00e-80146f36ba2f",
            createdAt: "2019-05-27T02:48:43.192+0000",
            updatedAt: "2019-05-27T02:48:43.192+0000",
            updatedBy: null,
            name: "template2",
            description: "temp2 desc",
            categoryList: [],
            projectTemplates: null
          }
        }
      ],
      projectSpecialties: []
    },
    subContractor: {
      id: "e26ab1b5-c1e7-43e7-8458-606f28b113dc",
      createdAt: "2019-05-27T02:45:50.429+0000",
      updatedAt: "2019-05-27T02:45:53.459+0000",
      updatedBy: null,
      email: "abc@a.com",
      status: "ACTIVE",
      statusReason: null,
      address: {
        id: "01814c32-538b-4d75-b0d2-a3d664e0f6fb",
        createdAt: "2019-05-27T02:45:52.060+0000",
        updatedAt: "2019-05-27T02:45:53.460+0000",
        updatedBy: null,
        name: "gen1 new",
        street: "123 dbc",
        city: "ad",
        phone: "32322"
      },
      contractorFiles: [],
      contractorSpecialties: []
    },
    proposalOptions: null,
    proposalFiles: [
      {
        id: "2db7e83d-1af2-4db1-92be-dda1c18fcc94",
        createdAt: "2019-05-27T05:36:38.384+0000",
        updatedAt: "2019-05-27T05:36:38.384+0000",
        updatedBy: null,
        name: "Screen Shot 2019-05-26 at 11.56.35 PM.png"
      }
    ]
  },
  temCatOptionDetail: [
    {
      "ea7216d2-8e47-45d9-8fdb-ca6dc631bc75": [
        // Template ID
        {
          "00a454c7-4190-4b00-bc08-151560baad74": [] // Category ID.Doesn’t have any Option yet, thus the array is empty
        },
        {
          "325041a0-8287-4ba6-a0fe-5a2944c0580e": [] // Category ID.Doesn’t have any Option yet, thus the array is empty
        },
        {
          "1260ace6-fb93-47c9-9f06-40a4721ef450": [] // Category ID/ Doesn’t have any Option yet, thus the array is empty
        },
        {
          "107aed60-42b5-4437-904e-7e95d560d88b": [
            // Category ID
            {
              id: "60f5d9f7-23cd-4ae0-9995-c8ff999e9d5c", // Option ID
              createdAt: "2019-05-28T04:11:00.145+0000",
              updatedAt: "2019-05-28T04:11:00.145+0000",
              updatedBy: null,
              name: "opt1",
              description: "desc11",
              value: "value1",
              budget: 100,
              duration: 10
            },
            {
              id: "57bf4212-73dc-4ed2-9f56-a86f801e6b50", // Option ID
              createdAt: "2019-05-28T04:11:07.632+0000",
              updatedAt: "2019-05-28T04:11:07.632+0000",
              updatedBy: null,
              name: "opt2",
              description: "desc2",
              value: "value2",
              budget: 200,
              duration: 5
            }
          ]
        }
      ]
    },
    {
      "4f4ace9e-1f78-43cf-b00e-80146f36ba2f": [] // Category ID
    }
  ]
};

export default {
  project: project,
  body: body,
  proposals: details
};
