const users = [
    { id: 'u-1', username: '赵敏', /*  repositories: [{ repsitoryId: 'r-1' }] */ },
    { id: 'u-2', username: '周芷若', /*  repositories: [{ repsitoryId: 'r-2' }, { repsitoryId: 'r-4' }] */ },
    { id: 'u-3', username: '小昭', /* repositories: [{ repsitoryId: 'r-3' }] */ }
]

const repsitories = [{
        id: 'r-1',
        url: 'www.github.org/赵敏',
        userId: "u-1",
        /* issues: [{ issueId: 'i-3' }, { issueId: 'i-5' }] */
    },
    { id: 'r-2', url: 'www.github.org/周芷若1', userId: "u-2", /* issues: [{ issueId: 'i-1' }, { issueId: 'i-2' }]  */},
    { id: 'r-3', url: 'www.github.org/小昭', userId: "u-3", /* issues: [{ issueId: 'i-6' }]  */},
    { id: 'r-4', url: 'www.github.org/周芷若2', userId: "u-2", /* issues: [{ issueId: 'i-7' }, { issueId: 'i-8' }, { issueId: 'i-9' }] */ },
]

const issues = [
    { id: 'i-1', text: '周芷若-汉水之滨', repositoryId: 'r-2' },
    { id: 'i-2', text: '周芷若-峨眉掌门', repositoryId: 'r-2' },
    { id: 'i-3', text: '赵敏-嫁给张无忌', repositoryId: 'r-1' },
    { id: 'i-4', text: '周芷若-教主夫人', repositoryId: 'r-2' },
    { id: 'i-5', text: '赵敏-郡主', repositoryId: 'r-1' },
    { id: 'i-6', text: '小昭-光明顶', repositoryId: 'r-3' },
    { id: 'i-7', text: '周芷若-美人胚子', repositoryId: 'r-4' },
    { id: 'i-8', text: '周芷若-丽容俏影', repositoryId: 'r-4' },
    { id: 'i-9', text: '周芷若-清丽如昔', repositoryId: 'r-4' },
]
export { users, repsitories, issues }