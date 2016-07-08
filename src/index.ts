class T3D {
    public static beginStr = "Begin Object";
    public static endStr = "End Object";

    public finish() {
        for (var i in this.finishCallbacks) {
            var callback = this.finishCallbacks[i];
            callback();
        }
    }

    public parser: Parser;

    constructor(parser: Parser) {
        this.parser = parser;
    }

    public finishCallbacks: Array<Function> = [];

    public isRoot: boolean = false;

    public children: Array<T3D> = [];

    public parent: T3D;

    public Name: string;
    public className: string;

    public nodeName: string;
    public parentNode: T3D;

    public static getClassName() {
        return (this as any).name;
    }

    public getClassName(): string {
        return this.className || (this as any).constructor.name;
    }

    public getNodeByName(name) {
        return this.parser.nodesMap[name];
    }

    public parseLine(line: string) {
        if (line.indexOf('ParentNode') > -1) {
            var parentName = this.parseParentName(line);
            var parent = this.getNodeByName(parentName);
            this.parent.removeChild(this);
            this.parent = parent;
        }
        if (line.indexOf('Children') > -1) {
            this.addParentFinishTask(() => {
                this.parseChildLine(line);
            })
        }


        if (line.indexOf('NodeName') > -1) {
            this.parseNodeName(line);
        }
    }


    public parseNodeName(line: string) {
        var reg = /NodeName="(.*)"/
        if (reg.test(line)) {
            var res = reg.exec(line);
            this.nodeName = res[1]
        }
    }

    public addParentFinishTask(callback: Function) {
        this.parent.finishCallbacks.push(callback)
    }

    public addRootFinishTask() {

    }

    public removeChild(obj: T3D) {
        var index = this.children.indexOf(obj);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    private parseParentName(line: string) {
        var reg = /ParentNode=[^']*'[^\:]*:(.*)'/
        if (reg.test(line)) {
            var res = reg.exec(line);
            var name = res[1];
            return name;
        }
    }

    private parseChildLine(line: string) {
        var reg = /Children\((\d+)\)=\(([^=]*)=([^']*)'((.*)\:(.*))'\)/
        if (reg.test(line)) {
            var res = reg.exec(line);
            var order = parseInt(res[1]);
            var childType = res[2];
            var btType = res[3];
            var asset = res[5];
            var name = res[6];
            var node = this.getNodeByName(name);
            this.children[order] = node;
        }
    }
}

class BTCompositeSelector extends T3D {

}

class BehaviorTree extends T3D {

}

class BehaviorTreeGraph extends T3D {

}

class BehaviorTreeGraphNode_Root extends T3D {

}

class EdGraphPin extends T3D {

}

class BehaviorTreeGraphNode_Composite extends T3D {

}

class BehaviorTreeGraphNode_CompositeDecorator extends T3D {

}

class BehaviorTreeDecoratorGraph extends T3D {

}

class BehaviorTreeDecoratorGraphNode_Logic extends T3D {

}

class BehaviorTreeGraphNode_SubtreeTask extends T3D {

}

class BTTask_RunBehavior extends T3D {
    public BehaviorAsset: string;
    public AssetName: string;
    public AssetPath: string;
    public parseLine(line: string) {
        super.parseLine(line);
        if (line.indexOf('BehaviorAsset') > -1) {
            this.parseBehaviorAsset(line);
        }
    }

    private parseBehaviorAsset(line: string) {
        var reg = /BehaviorTree'(([^\.]*)\.(.*))'/
        if (reg.test(line)) {
            var res = reg.exec(line);
            this.BehaviorAsset = res[1];
            this.AssetName = res[3];
            this.AssetPath = res[2];

            this.nodeName = this.AssetName;
        }
    }

}

class BTComposite_Sequence extends T3D {
    public parseLine(line: string) {
        super.parseLine(line);

    }


}

class BTComposite_Selector extends T3D {
    public parseLine(line: string) {
        super.parseLine(line);
    }


}

class BehaviorTreeGraphNode_Task extends T3D {

}

//TODO
class Blueprint extends T3D {

}

class BlackboardData extends T3D {

    public Keys: Array<{ name: string, type: string }> = [];

    public parseLine(line: string) {
        super.parseLine(line);
        if (line.indexOf('Keys(') > -1) {
            this.parseKeys(line);
        }
    }
    private parseKeys(line: string) {
        var reg = /Keys\((\d+)\)=\(EntryName="([^"]*)",KeyType=BlackboardKeyType_([^']+)'/
        if (reg.test(line)) {
            var res = reg.exec(line);
            this.Keys.push({
                name: res[2],
                type: res[3]
            })
        }
    }
}

class CustomNode extends T3D {

    public args: { [key: string]: any } = {};

    public parseLine(line: string) {
        super.parseLine(line);
        if (line.indexOf('ParentNode') > -1) {

        } else if (line.indexOf('TreeAsset') > -1) {

        } else {
            this.parseArguments(line);
        }
    }

    private parseArguments(line: string) {
        var reg = /([^=\s]*)=(.*)/
        if (reg.test(line)) {
            var res = reg.exec(line);
            var key = res[1];
            var val: any = res[2];
            if (!isNaN(val)) {
                val = parseFloat(val)
            }
            this.args[key] = val;
        }
    }
}

class 定义重合_C extends CustomNode {

}

class 定义跟随_C extends CustomNode {

}

class 定义衣柜宽度_C extends CustomNode {

}

class 定义窗帘宽度_C extends CustomNode {

}

class 定义床与床头柜宽度_C extends CustomNode {

}

class 定义吸附_C extends CustomNode {

}

class 定义背景墙_C extends CustomNode{

}

var sysClazzes = {

    BehaviorTree: BehaviorTree
    , BehaviorTreeGraph: BehaviorTreeGraph
    , BehaviorTreeGraphNode_Root: BehaviorTreeGraphNode_Root
    , EdGraphPin: EdGraphPin
    , BehaviorTreeGraphNode_Composite: BehaviorTreeGraphNode_Composite

    , BehaviorTreeGraphNode_CompositeDecorator: BehaviorTreeGraphNode_CompositeDecorator
    , BehaviorTreeDecoratorGraph: BehaviorTreeDecoratorGraph
    , BehaviorTreeDecoratorGraphNode_Logic: BehaviorTreeDecoratorGraphNode_Logic

    , BehaviorTreeGraphNode_SubtreeTask: BehaviorTreeGraphNode_SubtreeTask

    , BTTask_RunBehavior: BTTask_RunBehavior
    , BTComposite_Sequence: BTComposite_Sequence

    , BTComposite_Selector: BTComposite_Selector

    , 定义重合_C: 定义重合_C
    , 定义跟随_C: 定义跟随_C
    , 定义衣柜宽度_C: 定义衣柜宽度_C
    , 定义窗帘宽度_C: 定义窗帘宽度_C
    , 定义床与床头柜宽度_C: 定义床与床头柜宽度_C
    , 定义吸附_C: 定义吸附_C
    ,定义背景墙_C:定义背景墙_C
    , BehaviorTreeGraphNode_Task: BehaviorTreeGraphNode_Task
    , BlackboardData: BlackboardData
}

class Parser {

    private objectStack: Array<T3D> = [];
    private parsingObject: T3D;
    private root: T3D;
    public nodesMap: {
        [name: string]: T3D
    } = {};
    public parse(text: string) {
        var lines = text.split('\n');
        for (var i in lines) {
            var line = lines[i];
            this.parseLine(line)
        }
        return this.root;
    }


    private parseBeginLine(line) {
        var className = this.getClassNameFromString(line)
        var name = this.getNameFromString(line);
        var obj: T3D = null
        if (className) {
            //console.log(className)
            var clazz = sysClazzes[className]
            if (clazz != undefined) {
                obj = new clazz(this);
            } else {
                console.log('No Class: ', className)
                obj = new T3D(this);
            }
            obj.Name = name;
            obj.className = className;
            this.nodesMap[name] = obj;
        } else if (name) {
            obj = this.nodesMap[name]
        }


        if (obj) {
            if (!this.root) {
                this.root = obj;
                obj.isRoot = true;
            }


            this.parsingObject = obj;

            var parent = this.getLastStackNode();

            if (parent && parent !== obj && parent.children.indexOf(obj) == -1) {
                obj.parent = parent;
                parent.children.push(obj)
            }

            this.objectStack.push(obj);

            // switch (obj.getClassName()) {
            //     case "BehaviorTree":

            //         break;
            //     case "BTComposite_Sequence":

            //         break;

            //     default:


            // }
        }
    }

    private parseLine(line: string) {
        if (line.indexOf(T3D.beginStr) > -1) {
            this.parseBeginLine(line);
        } else if (line.indexOf(T3D.endStr) > -1) {
            this.parsingObject.finish();
            this.objectStack.pop();
            this.parsingObject = this.getLastStackNode();
        } else if (this.parsingObject) {
            this.parsingObject.parseLine(line);
        }
    }

    public getLastStackNode(): T3D {
        return this.objectStack[this.objectStack.length - 1]
    }

    private getClassNameFromString(str) {
        var reg = /Class=([^\s]*)\s/
        if (reg.test(str)) {
            var res = reg.exec(str);
            return res[1]
        } else {
            return null;
        }
    }

    private getNameFromString(str) {
        var reg = /Name="(.*)"/
        if (reg.test(str)) {
            var res = reg.exec(str);
            return res[1]
        } else {
            return null;
        }
    }

    public print(root: T3D) {
        var prev = 0;
        if (root instanceof BehaviorTree || root instanceof BlackboardData) {
            console.log(this.getPrevStr(prev) + this.getPrintName(root) );
            prev++;
            root.children.forEach((item) => {
                if (item instanceof BTComposite_Selector || item instanceof BTComposite_Sequence) {
                    console.log(this.getPrevStr(prev) + this.getPrintName(item) )
                    this.printNode(prev, item);
                }
            })
        }
    }

    private getPrintName(node){
       // console.log(node)
        if(node.nodeName != undefined){
            return node.nodeName;
        }else{
            return node.Name;
        }
    }

    private endIndex = []

    private getPrevStr(num: number) {
        var str = '--|';
        for (var i = 0; i < num; i++) {
            str += '--';
            if(this.endIndex.indexOf(i) > -1){
                str += '|'
            }
        }
        this.endIndex.push(i);
        //str += '|'
        return str;
    }

    public printNode(prev, node) {
        prev++;
        node.children.forEach((item) => {
            console.log(this.getPrevStr(prev) + this.getPrintName(item) )
            this.printNode(prev, item);
        })
    }
}


