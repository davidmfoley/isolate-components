import { describe, it } from 'mocha'
import React from 'react'
import { nodeTree } from '../src/nodeTree'
import { expect } from 'chai'
import { IsolatedRenderer } from '../src/isolatedRenderer'

const nullRenderer: IsolatedRenderer = {
  render: () => ({} as any),
  shouldInline: () => false,
}

describe('nodeTree ', () => {
  it('can parse a single html element', () => {
    const tree = nodeTree(<div />, nullRenderer)
    const root = tree.root()

    expect(root.nodeType).to.eq('html')
    expect(root.type).to.eq('div')
    expect(root.children).to.eql([])
  })

  it('can parse a single component', () => {
    const Example = () => <div />
    const tree = nodeTree(<Example />, nullRenderer)
    const root = tree.root()

    expect(root.nodeType).to.eq('react')
    expect(root.type).to.eq(Example)
    expect(root.children).to.eql([])
  })

  it('can parse children', () => {
    const Parent = ({ children }) => <div>{children}</div>
    const Child = () => <div />
    const tree = nodeTree(
      <Parent>
        <Child />
      </Parent>,
      nullRenderer
    )
    const root = tree.root()

    expect(root.nodeType).to.eq('react')
    expect(root.type).to.eq(Parent)
    expect(root.children.length).to.eql(1)
    expect(root.children[0].type).to.eql(Child)
  })

  it('can find children', () => {
    const tree = nodeTree(
      <section>
        <ul>
          <li>A</li>
          <li>
            <span>B</span>
          </li>
        </ul>
      </section>,
      nullRenderer
    )

    const section = tree.findOne('section')

    expect(section.exists('ul')).to.eq(true)
    expect(section.exists('div')).to.eq(false)

    expect(section.findAll('li').length).to.eq(2)
    section.findOne('ul')

    expect(() => section.findOne('div')).to.throw()
    expect(() => section.findOne('li')).to.throw()

    section.findOne('ul').findAll('li')[1].findOne('span')
  })

  it('handles stringifying numbers in content', () => {
    const tree = nodeTree(<span>{3}</span>, nullRenderer)
    expect(tree.root().content()).to.eq('3')
  })

  it('handles stringifying numbers in props', () => {
    const MagicNumber = (_: { value: number }) => null
    const tree = nodeTree(<MagicNumber value={3} />, nullRenderer)

    expect(tree.root().toString()).to.eq(`<MagicNumber value={3} />`)
  })

  it('handles an empty fragment', () => {
    const parsed = nodeTree(<></>, nullRenderer)
    expect(parsed.root().toString()).to.eq('')
  })

  it('handles a fragment with a false boolean value', () => {
    const parsed = nodeTree(<>{false}</>, nullRenderer)
    expect(parsed.root().toString()).to.eq('')
  })

  it('handles false', () => {
    const parsed = nodeTree(false, nullRenderer)
    expect(parsed.root().toString()).to.eq('')
  })

  it('handles true', () => {
    const parsed = nodeTree(true, nullRenderer)
    expect(parsed.root().toString()).to.eq('')
  })

  it('handles undefined', () => {
    const parsed = nodeTree(undefined, nullRenderer)
    expect(parsed.root().toString()).to.eq('')
  })

  it('exposes content via content() and toString()', () => {
    const List: React.FC<{ className: string }> = () => null
    const ListItem: React.FC<{}> = () => null
    const tree = nodeTree(
      <List className="listy-list">
        <ListItem>Arthur</ListItem>
        <ListItem>Trillian</ListItem>
      </List>,
      nullRenderer
    )
    const root = tree.root()

    expect(root.content()).to.eq(
      '<ListItem>Arthur</ListItem><ListItem>Trillian</ListItem>'
    )

    expect(root.toString()).to.eq(
      '<List className="listy-list"><ListItem>Arthur</ListItem><ListItem>Trillian</ListItem></List>'
    )
  })
})
