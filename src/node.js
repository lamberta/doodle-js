#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle
(->
  node_count = 0
  node_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  range_check = doodle.utils.debug.range_check
  reference_check = doodle.utils.debug.reference_check
  
  #END_DEBUG
  
  #recycled events
  evt_addedEvent = doodle.events.Event(doodle.events.Event.ADDED, true)
  evt_removedEvent = doodle.events.Event(doodle.events.Event.REMOVED, true)
  createPoint = doodle.geom.createPoint
  createMatrix = doodle.geom.createMatrix
  createRectangle = doodle.geom.createRectangle
  create_scene_path = doodle.utils.create_scene_path
  PI = Math.PI
  
  ###
  @name doodle.createNode
  @class
  @augments doodle.Emitter
  @param {string=} id|initializer
  @return {doodle.Node}
  ###
  doodle.Node = doodle.createNode = (id) ->
    node = Object.create(doodle.createEmitter())
    
    #DEBUG
    throw new SyntaxError("[object Node](id): Invalid number of parameters.")  if arguments_.length > 1
    
    #END_DEBUG
    Object.defineProperties node, node_static_properties
    
    #properties that require privacy
    Object.defineProperties node,
      
      #DEBUG
      debug:
        
        #Debugging oprions
        enumerable: true
        configurable: false
        value: Object.create(null,
          
          ###
          @name debug.boundingBox
          @return {boolean}
          @property
          ###
          boundingBox: (->
            show_bounds = false
            enumerable: true
            configurable: false
            get: ->
              show_bounds

            set: (showBoundingBox) ->
              show_bounds = (showBoundingBox is true)
          ())
        )

      
      #END_DEBUG
      
      ###
      @name id
      @return {string}
      @property
      ###
      id: (->
        node_id = (if (typeof id is "string") then id else "node" + String("000" + node_count).slice(-3))
        node_count += 1
        enumerable: true
        configurable: true
        get: ->
          node_id

        set: (idArg) ->
          
          #DEBUG
          type_check idArg, "string",
            label: "Node.id"
            id: @id

          
          #END_DEBUG
          node_id = idArg
      ())
      
      ###
      @name root
      @return {Display}
      @property
      ###
      root: (->
        root = null
        enumerable: true
        configurable: true
        get: ->
          root

        set: (node) ->
          
          #DEBUG
          if node isnt null
            type_check node, "Display",
              label: "Node.root"
              id: @id
              inherits: true

          
          #END_DEBUG
          root = node
      ())
      
      ###
      @name parent
      @return {Node}
      @property
      ###
      parent: (->
        parent = null
        enumerable: true
        configurable: true
        get: ->
          parent

        set: (node) ->
          
          #DEBUG
          if node isnt null
            type_check node, "Node",
              label: "Node.parent"
              id: @id
              inherits: true

          
          #END_DEBUG
          parent = node
      ())
      
      ###
      @name children
      @return {Array}
      @property
      ###
      children: (->
        children = []
        enumerable: true
        configurable: false
        get: ->
          children
      ())
      
      ###
      @name transform
      @return {Matrix}
      @property
      ###
      transform: (->
        transform = createMatrix(1, 0, 0, 1, 0, 0)
        enumerable: true
        configurable: false
        get: ->
          transform

        set: (matrix) ->
          
          #DEBUG
          type_check matrix, "Matrix",
            label: "Node.transform"
            id: @id

          
          #END_DEBUG
          transform = matrix
      ())
      
      ###
      @name visible
      @return {boolean}
      @property
      ###
      visible: (->
        visible = true
        enumerable: true
        configurable: true
        get: ->
          visible

        set: (isVisible) ->
          
          #DEBUG
          type_check isVisible, "boolean",
            label: "Node.visible"
            id: @id

          
          #END_DEBUG
          visible = isVisible
      ())
      
      ###
      @name alpha
      @return {number}
      @property
      ###
      alpha: (->
        alpha = 1 #alpha is between 0 and 1
        enumerable: true
        configurable: true
        get: ->
          alpha

        set: (alphaArg) ->
          
          #DEBUG
          type_check alphaArg, "number",
            label: "Node.alpha"
            id: @id

          range_check window.isFinite(alphaArg),
            label: "Node.alpha"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          alpha = (if (alphaArg > 1) then 1 else ((if (alphaArg < 0) then 0 else alphaArg)))
      ())
      
      ###
      The bounding box of a Node is a union of all it's child Sprite's bounds.
      @name getBounds
      @param {Node} targetCoordSpace
      @return {Rectangle|null}
      ###
      getBounds:
        enumerable: true
        writable: true
        configurable: false
        value: (targetCoordSpace) ->
          
          #DEBUG
          type_check targetCoordSpace, "Node",
            label: "Node.getBounds"
            params: "targetCoordSpace"
            id: @id
            inherits: true

          
          #END_DEBUG
          @__getBounds(targetCoordSpace).clone()

      
      # Same as getBounds, but reuses an internal rectangle.
      #       * Since it's passed by reference, you don't want to modify it, but
      #       * it's more efficient for checking bounds.
      #       * @name __getBounds
      #       * @private
      #       
      __getBounds:
        enumerable: false
        writable: true
        configurable: false
        value: (->
          rect = createRectangle(0, 0, 0, 0) #recycle
          (targetCoordSpace) ->
            
            #DEBUG
            type_check targetCoordSpace, "Node",
              label: "Node.__getBounds"
              params: "targetCoordSpace"
              id: @id
              inherits: true

            
            #END_DEBUG
            bounding_box = null
            child_bounds = undefined
            children = @children
            len = children.length
            while len--
              child_bounds = children[len].__getBounds(targetCoordSpace)
              if child_bounds isnt null
                if bounding_box is null
                  bounding_box = rect.__compose(child_bounds)
                else
                  bounding_box.__union child_bounds
            bounding_box
        ())

    #end defineProperties
    
    #passed an initialization function
    if typeof arguments_[0] is "function"
      arguments_[0].call node
      id = `undefined`
    node

  node_static_properties =
    
    ###
    @name x
    @return {number}
    @property
    ###
    x:
      enumerable: true
      configurable: false
      get: ->
        @transform.tx

      set: (n) ->
        
        #DEBUG
        type_check n, "number",
          label: "Node.x"
          id: @id

        
        #range_check(window.isFinite(n), {label:'Node.x', id:this.id, message:"Parameter must be a finite number."});
        #END_DEBUG
        @transform.tx = n

    
    ###
    @name y
    @return {number}
    @property
    ###
    y:
      enumerable: true
      configurable: false
      get: ->
        @transform.ty

      set: (n) ->
        
        #DEBUG
        type_check n, "number",
          label: "Node.y"
          id: @id

        
        #range_check(window.isFinite(n), {label:'Node.y', id:this.id, message:"Parameter must be a finite number."});
        #END_DEBUG
        @transform.ty = n

    
    #
    #    //registration point
    #    'axis': {
    #      value: {x: this.x, y: this.y}
    #    },
    #
    #    'rotate': { //around external point?
    #      value: function (deg) {
    #      
    #        check_number_type(deg, this+'.rotate', '*degrees*');
    #
    #        if (this.axis.x !== undefined && this.axis.y !== undefined) {
    #          this.transform.rotateAroundInternalPoint(this.axis, deg*to_radians);
    #        } else {
    #          this.transform.rotate(deg * to_radians);
    #        }
    #      }
    #    },
    #    
    
    ###
    @name rotate
    @param {number} deg
    @return {number}
    ###
    rotate:
      enumerable: true
      configurable: false
      value: (deg) ->
        
        #DEBUG
        type_check deg, "number",
          label: "Node.rotate"
          id: @id
          params: "degrees"
          message: "Parameter must be a number in degrees."

        range_check window.isFinite(deg),
          label: "Node.rotate"
          id: @id
          message: "Parameter must be a finite number."

        
        #END_DEBUG
        @transform.rotate deg * PI / 180

    
    ###
    @name rotation
    @return {number}
    @property
    ###
    rotation:
      enumerable: true
      configurable: true
      get: ->
        @transform.rotation * 180 / PI

      set: (deg) ->
        
        #DEBUG
        type_check deg, "number",
          label: "Node.rotation"
          id: @id
          message: "Parameter must be a number in degrees."

        range_check window.isFinite(deg),
          label: "Node.rotation"
          id: @id
          message: "Parameter must be a finite number."

        
        #END_DEBUG
        @transform.rotation = deg * PI / 180

    
    ###
    @name scaleX
    @param {number} sx
    @return {number}
    ###
    scaleX:
      enumerable: true
      configurable: false
      get: ->
        @transform.a

      set: (sx) ->
        
        #DEBUG
        type_check sx, "number",
          label: "Node.scaleX"
          id: @id

        
        #range_check(window.isFinite(sx), {label:'Node.scaleX', id:this.id, message:"Parameter must be a finite number."});
        #END_DEBUG
        @transform.a = sx

    
    ###
    @name scaleY
    @param {number} sy
    @return {number}
    ###
    scaleY:
      enumerable: true
      configurable: false
      get: ->
        @transform.d

      set: (sy) ->
        
        #DEBUG
        type_check sy, "number",
          label: "Node.scaleY"
          id: @id

        
        #range_check(window.isFinite(sy), {label:'Node.scaleY', id:this.id, message:"Parameter must be a finite number."});
        #END_DEBUG
        @transform.d = sy

    
    ###
    drawing context to use
    @name context
    @return {CanvasRenderingContext2D}
    @property
    ###
    context:
      enumerable: true
      configurable: true
      get: ->
        
        #will keep checking parent for context till found or null
        node = @parent
        while node
          if node.context
            
            #DEBUG
            type_check node.context, "context",
              label: "Node.context"
              id: @id

            
            #END_DEBUG
            return node.context
          node = node.parent
        null

    
    #
    #     * @name __allTransforms
    #     * @private
    #     
    __allTransforms:
      enumerable: false
      configurable: false
      get: (->
        transform = createMatrix(1, 0, 0, 1, 0, 0)
        ->
          $transform = transform
          node = @parent
          $transform.compose.apply $transform, @transform.__toArray()
          while node
            $transform.multiply node.transform
            node = node.parent
          $transform
      ())

    
    ###
    Returns the string representation of the specified object.
    @name toString
    @return {string}
    @override
    ###
    toString:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        "[object Node]"

    
    ###
    @name addChildAt
    @param {Node} node
    @param {number} index
    @return {Node}
    @throws {TypeError}
    ###
    addChildAt:
      enumerable: true
      writable: false
      configurable: false
      value: (node, index) ->
        children = @children
        display = @root
        node_parent = node.parent
        i = undefined
        
        #DEBUG
        type_check node, "Node", index, "number",
          label: "Node.addChildAt"
          params: ["node", "index"]
          inherits: true
          id: @id

        range_check index >= -children.length, index <= children.length,
          label: "Node.addChildAt"
          params: ["node", "*index*"]
          id: @id
          message: "Index out of range."

        
        #END_DEBUG
        
        #if already a child then ignore
        return false  if children.indexOf(node) isnt -1
        
        #if it had another parent, remove from their children
        node.parent.removeChild node  if node_parent isnt null and node_parent isnt this
        node.parent = this
        
        #add child
        children.splice index, 0, node
        
        #are we on the display path and node not previously on path
        if display and node.root isnt display
          
          #resort scene graph
          display.__sortAllChildren()
          children = create_scene_path(node, [])
          i = children.length
          while i--
            node = children[i]
            
            #set new root for all descendants
            node.root = display
            
            #fire Event.ADDED if now on display list
            node.emit evt_addedEvent.__setTarget(null)
        node

    
    ###
    @name addChild
    @param {Node} node
    @return {Node}
    @throws {TypeError}
    ###
    addChild:
      enumerable: true
      writable: false
      configurable: false
      value: (node) ->
        
        #DEBUG
        type_check node, "Node",
          label: "Node.addChild"
          id: @id
          params: "node"
          inherits: true

        
        #END_DEBUG
        
        #add to end of children array
        @addChildAt node, @children.length

    
    ###
    Adds this node to the given node's children.
    If appending to a Display object, attach to it's top child.
    @name appendTo
    @return {Node}
    @throws {TypeError}
    ###
    appendTo:
      enumerable: true
      writable: false
      configurable: false
      value: (node) ->
        
        #DEBUG
        type_check node, "Node",
          label: "Node.appendTo"
          id: @id
          params: "node"
          inherits: true

        
        #END_DEBUG
        if doodle.Display.isDisplay(node)
          
          #DEBUG
          reference_check node.children.length > 0,
            label: "Node.appendTo"
            params: "*node*"
            id: @id
            message: "Display does not have any child layers to add to."

          
          #END_DEBUG
          node.children[0].addChild this
        else
          node.addChild this

    
    ###
    @name createNode
    ###
    createNode:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        @addChild doodle.createNode.apply(`undefined`, arguments_)

    
    ###
    @name createSprite
    ###
    createSprite:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        @addChild doodle.createSprite.apply(`undefined`, arguments_)

    
    ###
    @name removeChildAt
    @param {number} index
    @return {Node} Removed child node.
    @throws {TypeError}
    @throws {RangeError}
    ###
    removeChildAt:
      enumerable: true
      writable: false
      configurable: false
      value: (index) ->
        
        #DEBUG
        type_check index, "number",
          label: "Node.removeChildAt"
          id: @id
          params: "index"

        range_check index >= -@children.length, index < @children.length,
          label: "Node.removeChildAt"
          params: "*index*"
          id: @id
          message: "Index out of range."

        
        #END_DEBUG
        child = @children.splice(index, 1)[0] #unadopt
        child_descendants = create_scene_path(child) #includes child
        i = child_descendants.length
        j = i
        
        #event dispatching depends on an intact scene graph
        if @root
          child_descendants[i].emit evt_removedEvent.__setTarget(null)  while i--
          child_descendants[j].root = null  while j--
        
        #reset child and descendants
        child.parent = null
        
        #reorder this display's scene path
        @root.__sortAllChildren()  if @root
        child

    
    ###
    @name removeChild
    @param {Node} node
    @return {Node} Removed child node.
    @throws {TypeError}
    @throws {ReferenceError}
    ###
    removeChild:
      enumerable: false
      writable: false
      configurable: false
      value: (node) ->
        
        #DEBUG
        type_check node, "Node",
          label: "Node.removeChild"
          id: @id
          params: "node"
          inherits: true

        reference_check node.parent is this,
          label: "Node.removeChild"
          params: "*node*"
          id: @id
          message: "Can not remove a Node that is not a child."

        console.assert @children.indexOf(node) isnt -1, "Node found in children", node
        
        #END_DEBUG
        @removeChildAt @children.indexOf(node)

    
    ###
    @name removeChildById
    @param {string} id
    @return {Node} Removed child node.
    @throws {TypeError}
    ###
    removeChildById:
      enumerable: true
      writable: false
      configurable: false
      value: (id) ->
        
        #DEBUG
        type_check id, "string",
          label: "Node.removeChildById"
          id: @id
          params: "id"

        
        #END_DEBUG
        @removeChild @getChildById(id)

    
    ###
    @name removeAllChildren
    @throws {TypeError}
    ###
    removeAllChildren:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        children = @children
        display = @root
        child_descendants = create_scene_path(this, [])
        n = children.length
        i = undefined
        j = undefined
        
        #DEBUG
        console.assert child_descendants[child_descendants.length - 1] is this, "Last item in array is this Node."
        
        #END_DEBUG
        child_descendants.pop() #remove this node
        i = j = child_descendants.length
        
        #event dispatching depends on an intact scene graph
        child_descendants[i].emit evt_removedEvent.__setTarget(null)  while i--  if display
        
        #reset root of all descendants
        child_descendants[j].root = null  while j--
        
        #reset parent of children
        children[n].parent = null  while n--
        
        #un-adopt children
        children.length = 0
        
        #reorder this display's scene path
        display.__sortAllChildren()  if display

    
    ###
    @name getChildById
    @param {string} id
    @return {Node|undefined}
    @throws {TypeError}
    ###
    getChildById:
      enumerable: true
      writable: false
      configurable: false
      value: (id) ->
        
        #DEBUG
        type_check id, "string",
          label: "Node.getChildById"
          params: "id"
          id: @id

        
        #END_DEBUG
        children = @children
        len = children.length
        i = 0
        while i < len
          return children[i]  if children[i].id is id
          i++
        `undefined`

    
    ###
    Changes the position of an existing child in the node's children array.
    This affects the layering of child objects.
    @name setChildIndex
    @param {Node} child
    @param {number} index
    @throws {TypeError}
    ###
    setChildIndex:
      enumerable: true
      writable: false
      configurable: false
      value: (child, index) ->
        children = @children
        pos = children.indexOf(child)
        
        #DEBUG
        window.debug_len = children.length
        type_check child, "Node", index, "number",
          label: "Node.setChildIndex"
          params: ["child", "index"]
          id: @id
          inherits: true

        range_check index >= -children.length, index < children.length,
          label: "Node.setChildIndex"
          params: ["child", "*index*"]
          id: @id
          message: "Index out of range."

        reference_check child.parent is this,
          label: "Node.setChildIndex"
          params: ["*child*", "index"]
          id: @id
          message: "Can not set the index of a Node that is not a child."

        console.assert pos isnt -1, "Found child node, should be able to detect range with index.", this
        
        #END_DEBUG
        children.splice pos, 1 #remove child
        children.splice index, 0, child #place child at new position
        
        #reorder this display's scene path
        @root.__sortAllChildren()  if @root
        
        #DEBUG
        console.assert window.debug_len is children.length, "Children array length is still the same."
        delete window.debug_len

    
    #END_DEBUG
    
    ###
    Swaps the child nodes at the two specified index positions in the child list.
    @name swapChildrenAt
    @param {number} index1
    @param {number} index2
    @throws {TypeError}
    @throws {RangeError}
    ###
    swapChildrenAt:
      enumerable: true
      writable: false
      configurable: false
      value: (index1, index2) ->
        children = @children
        temp_node = undefined
        
        #DEBUG
        window.debug_len = children.length
        type_check index1, "number", index2, "number",
          label: "Node.swapChildrenAt"
          params: ["index1", "index2"]
          id: @id

        range_check index1 >= -children.length, index1 < children.length,
          label: "Node.setChildIndex"
          params: ["*index1*", "index2"]
          id: @id
          message: "Index out of range."

        range_check index2 >= -children.length, index2 < children.length,
          label: "Node.setChildIndex"
          params: ["index1", "*index2*"]
          id: @id
          message: "Index out of range."

        
        #asserts
        console.assert doodle.Node.isNode(children[index1]), "Child is a Node.", children[index1]
        console.assert doodle.Node.isNode(children[index2]), "Child is a Node.", children[index2]
        console.assert children[index1].parent is this, "Child's parent is this Node.", children[index1]
        console.assert children[index2].parent is this, "Child's parent is this Node.", children[index2]
        
        #END_DEBUG
        
        #need to get a little fancy so we can refer to negative indexes
        temp_node = children.splice(index1, 1, `undefined`)[0]
        children.splice index1, 1, children.splice(index2, 1, `undefined`)[0]
        children[children.indexOf(`undefined`)] = temp_node
        
        #reorder this display's scene path
        @root.__sortAllChildren()  if @root
        
        #DEBUG
        console.assert window.debug_len is children.length, "Children array length is still the same."
        delete window.debug_len

    
    #END_DEBUG
    
    ###
    @name swapChildren
    @param {Node} node1
    @param {Node} node2
    @throws {TypeError}
    ###
    swapChildren:
      enumerable: true
      writable: false
      configurable: false
      value: (node1, node2) ->
        children = @children
        
        #DEBUG
        type_check node1, "Node", node2, "Node",
          label: "Node.swapChildren"
          id: @id
          params: ["node1", "node2"]
          inherits: true

        reference_check node1.parent is this, node2.parent is this,
          label: "Node.swapChildren"
          params: ["child1", "child2"]
          id: @id
          message: "Can not swap a Node that is not a child."

        
        #END_DEBUG
        @swapChildrenAt children.indexOf(node1), children.indexOf(node2)

    
    ###
    Swap positions with a sibling node.
    @name swapDepths
    @param {Node} node
    @throws {TypeError}
    @throws {ReferenceError}
    ###
    swapDepths:
      enumerable: true
      writable: false
      configurable: false
      value: (node) ->
        parent = @parent
        children = undefined
        
        #DEBUG
        type_check node, "Node",
          label: "Node.swapDepths"
          params: "node"
          id: @id
          inherits: true

        reference_check parent isnt null, node.parent is parent,
          label: "Node.swapDepths"
          params: "*node*"
          id: @id
          message: "Can not swap positions with a Node that has a different parent."

        console.assert doodle.Node.isNode(parent), "parent is a Node", parent
        
        #END_DEBUG
        children = parent.children
        parent.swapChildrenAt children.indexOf(this), children.indexOf(node)

    
    ###
    Swap positions with another node at a given index in the parents child list.
    @name swapDepthAt
    @param {number} index
    @throws {TypeError}
    @throws {RangeError}
    ###
    swapDepthAt:
      enumerable: true
      writable: false
      configurable: false
      value: (index) ->
        
        #DEBUG
        type_check index, "number",
          label: "Node.swapDepthAt"
          params: "index"
          id: @id

        reference_check @parent isnt null,
          label: "Node.swapDepthAt"
          params: "*index*"
          id: @id
          message: "Node does not have a parent."

        console.assert doodle.Node.isNode(@parent), "Node has parent Node."
        range_check index >= -@parent.children.length, index < @parent.children.length,
          label: "Node.swapDepthAt"
          params: "*index1*"
          id: @id
          message: "Index out of range."

        
        #END_DEBUG
        @parent.swapChildrenAt @parent.children.indexOf(this), index

    
    ###
    Determine if node is among it's children, grandchildren, etc.
    @name contains
    @param {Node} node
    @return {boolean}
    @throws {TypeError}
    ###
    contains:
      enumerable: true
      writable: false
      configurable: false
      value: (node) ->
        
        #DEBUG
        type_check node, "Node",
          label: "Node.contains"
          params: "node"
          id: @id
          inherits: true

        
        #END_DEBUG
        (if (create_scene_path(this, []).indexOf(node) isnt -1) then true else false)

    
    ###
    @name localToGlobal
    @param {Point} pt
    @return {Point}
    @throws {TypeError}
    ###
    localToGlobal:
      enumerable: true
      writable: false
      configurable: false
      value: (pt) ->
        
        #DEBUG
        type_check pt, "Point",
          label: "Node.localToGlobal"
          params: "point"
          id: @id

        
        #END_DEBUG
        node = @parent
        
        #apply each transformation from this node up to root
        pt = @transform.transformPoint(pt) #new point
        while node
          
          #DEBUG
          console.assert doodle.Node.isNode(node), "node is a Node", node
          
          #END_DEBUG
          node.transform.__transformPoint pt #modify point
          node = node.parent
        pt

    
    ###
    Same as localToGlobal, but modifies a point in place.
    @name __localToGlobal
    @param {Point} pt
    @return {Point}
    @throws {TypeError}
    @private
    ###
    __localToGlobal:
      enumerable: false
      writable: false
      configurable: false
      value: (pt) ->
        
        #DEBUG
        type_check pt, "Point",
          label: "Node.__localToGlobal"
          params: "point"
          id: @id

        
        #END_DEBUG
        node = this
        
        #apply each transformation from this node up to root
        while node
          
          #DEBUG
          console.assert doodle.Node.isNode(node), "node is a Node", node
          
          #END_DEBUG
          node.transform.__transformPoint pt #modify point
          node = node.parent
        pt

    
    ###
    @name globalToLocal
    @param {Point} pt
    @return {Point}
    @throws {TypeError}
    ###
    globalToLocal:
      enumerable: true
      writable: false
      configurable: false
      value: (pt) ->
        
        #DEBUG
        type_check pt, "Point",
          label: "Node.globalToLocal"
          id: @id
          params: "point"

        
        #END_DEBUG
        global_pt =
          x: 0
          y: 0

        @__localToGlobal global_pt
        createPoint pt.x - global_pt.x, pt.y - global_pt.y

    
    ###
    Same as globalToLocal, but modifies a point in place.
    @name __globalToLocal
    @param {Point} pt
    @return {Point}
    @throws {TypeError}
    @private
    ###
    __globalToLocal:
      enumerable: false
      writable: false
      configurable: false
      value: (pt) ->
        
        #DEBUG
        type_check pt, "Point",
          label: "Node.__globalToLocal"
          id: @id
          params: "point"

        
        #END_DEBUG
        global_pt = #use temp point instead?
          x: 0
          y: 0

        @__localToGlobal global_pt
        pt.x = pt.x - global_pt.x
        pt.y = pt.y - global_pt.y
        pt
#end node_static_properties
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object inherits from Node.
@name isNode
@param {Object} obj
@return {boolean}
@static
###
doodle.Node.isNode = (obj) ->
  if typeof obj is "object"
    while obj
      if obj.toString() is "[object Node]"
        return true
      else
        obj = Object.getPrototypeOf(obj)
  false
