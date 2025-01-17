var cslSchemaFiles = {
"csl.rnc": `namespace a = "http://relaxng.org/ns/compatibility/annotations/1.0"
namespace bibo = "http://purl.org/ontology/bibo/"
namespace cs = "http://purl.org/net/xbiblio/csl"
namespace dc = "http://purl.org/dc/elements/1.1/"
namespace sch = "http://purl.oclc.org/dsdl/schematron"
namespace xhtml = "http://www.w3.org/1999/xhtml"

# CSL schema metadata

dc:title [ "Citation Style Language" ]
dc:creator [ "Bruce D'Arcus" ]
dc:creator [ "Simon Kornblith" ]
bibo:editor [ "Frank Bennett" ]
bibo:editor [ "Rintze Zelle" ]
dc:rights [
  "Copyright 2007-2020 Citation Style Language and contributors"
]
dc:license [ "MIT license" ]
dc:description [
  "RELAX NG compact schema for the Citation Style Language (CSL)."
]

## Subparts of the CSL schema
include "csl-choose.rnc"
include "csl-terms.rnc"
include "csl-types.rnc"
include "csl-variables.rnc"
include "csl-categories.rnc"
# ==============================================================================

## cs:style and cs:locale - Root Elements
div {
  start =
    independent-style.style | dependent-style.style | locale-file.locale
  independent-style.style =
    element cs:style {
      
      ## Select whether citations appear in-text or as notes.
      attribute class { "in-text" | "note" },
      style.default-locale,
      style.options,
      version,
      independent-style.style.info,
      (style.locale*
       & style.macro*
       & style.citation
       & style.bibliography?)
    }
  dependent-style.style =
    element cs:style {
      style.default-locale, version, dependent-style.style.info
    }
  style.default-locale =
    
    ## Set a default style locale.
    attribute default-locale { xsd:language }?
  version =
    
    ## Indicate CSL version compatibility.
    [ a:defaultValue = "1.0" ] attribute version { "1.0" }
}
# ==============================================================================

## cs:info - Style and Locale File Metadata
div {
  
  ## Metadata for independent styles.
  independent-style.style.info =
    element cs:info {
      info.author*
      & info.category*
      & info.contributor*
      & info.id
      & info.issn*
      & info.eissn?
      & info.issnl?
      & independent-style.info.link*
      & info.published?
      & info.rights?
      & info.summary?
      & info.title
      & info.title-short?
      & info.updated
    }
  
  ## Metadata for dependent styles.
  dependent-style.style.info =
    element cs:info {
      info.author*
      & info.category*
      & info.contributor*
      & info.id
      & info.issn*
      & info.eissn?
      & info.issnl?
      & dependent-style.info.link+
      & info.published?
      & info.rights?
      & info.summary?
      & info.title
      & info.title-short?
      & info.updated
    }
  
  ## Metadata for locale files.
  locale-file.locale.info =
    element cs:info { info.translator* & info.rights? & info.updated? }
  info.author = element cs:author { personal-details }
  info.contributor = element cs:contributor { personal-details }
  info.translator = element cs:translator { personal-details }
  personal-details =
    element cs:name { text }
    & element cs:email { text }?
    & element cs:uri { xsd:anyURI }?
  info.category =
    
    ## Specify the citation format of the style (using the "citation-format"
    ## attribute) or the fields and disciplines for which the style is
    ## relevant (using the "field" attribute).
    element cs:category {
      attribute citation-format { category.citation-format }
      | attribute field { category.field }
    }
  info.id =
    
    ## Specify the unique and stable identifier for the style. A URI
    ## is valid, but new styles should use a UUID to ensure stability
    ## and uniqueness.
    element cs:id { xsd:anyURI }
  info.issn =
    
    ## Specify the journal's ISSN(s) for journal-specific styles. An ISSN
    ## must consist of four digits, a hyphen, three digits, and a check
    ## digit (a numeral digit or roman X), e.g. "1234-1231".
    element cs:issn { issn }
  info.eissn =
    
    ## Specify the journal's eISSN for journal-specific styles.
    element cs:eissn { issn }
  info.issnl =
    
    ## Specify the journal's ISSN-L for journal-specific styles.
    element cs:issnl { issn }
  issn = xsd:string { pattern = "\\d{4}\\-\\d{3}(\\d|x|X)" }
  independent-style.info.link =
    element cs:link {
      attribute href { xsd:anyURI },
      
      ## Specify how the URL relates to the style.
      attribute rel {
        
        ## The URI of the CSL style itself.
        "self"
        | 
          ## URI of the style from which the current style is derived.
          "template"
        | 
          ## URI of style documentation.
          "documentation"
      },
      info-text
    }
  dependent-style.info.link =
    element cs:link {
      attribute href { xsd:anyURI },
      
      ## Specify how the URL relates to the style.
      attribute rel {
        
        ## The URI of the CSL style itself.
        "self"
        | 
          ## URI of the CSL style whose content should be used for
          ## processing. Required for dependent styles.
          "independent-parent"
        | 
          ## URI of style documentation.
          "documentation"
      },
      info-text
    }
  info.published =
    
    ## Specify when the style was initially created or made available.
    element cs:published { xsd:dateTime }
  info.rights =
    element cs:rights {
      attribute license { xsd:anyURI }?,
      info-text
    }
  info.summary = element cs:summary { info-text }
  info.title = element cs:title { info-text }
  info.title-short =
    
    ## Specify an abbreviated style title (e.g., "APA")
    element cs:title-short { info-text }
  info.updated =
    
    ## Specify when the style was last updated (e.g.,
    ## "2007-10-26T21:32:52+02:00")
    element cs:updated { xsd:dateTime }
  info-text =
    attribute xml:lang { xsd:language }?,
    text
}
# ==============================================================================

## cs:locale in Independent Styles
div {
  style.locale =
    
    ## Use to (re)define localized terms, dates and options.
    element cs:locale {
      
      ## Specify the affected locale(s). If "xml:lang" is not set, the
      ## "cs:locale" element affects all locales.
      attribute xml:lang { xsd:language }?,
      (locale.style-options? & locale.date* & locale.terms?)
    }
}
# ==============================================================================

## cs:locale Contents - Localization Data
div {
  
  ## Localized global options are specified as attributes in the
  ## cs:style-options element. If future versions of CSL include localized
  ## options that are citation or bibliography specific, the elements
  ## cs:citation-options and cs:bibliography-options can be added.
  locale.style-options =
    element cs:style-options {
      
      ## Limit the "ordinal" form to the first day of the month.
      [ a:defaultValue = "false" ]
      attribute limit-day-ordinals-to-day-1 { xsd:boolean }?,
      
      ## Specify whether punctuation (a period or comma) is placed within
      ## or outside (default) the closing quotation mark.
      [ a:defaultValue = "false" ]
      attribute punctuation-in-quote { xsd:boolean }?
    }
  locale-file.locale =
    element cs:locale {
      
      ## Specify the locale of the locale file.
      attribute xml:lang { xsd:language },
      version,
      locale-file.locale.info?,
      (locale.style-options & locale.date+ & locale.terms)
    }
  locale.date =
    element cs:date {
      date.form,
      delimiter,
      font-formatting,
      text-case,
      locale.date.date-part+
    }
  date.form =
    
    ## Select the localized date format ("text" or "numeric").
    attribute form {
      
      ## Text date form (e.g., "December 15, 2005").
      "text"
      | 
        ## Numeric date form (e.g., "2005-12-15").
        "numeric"
    }
  locale.date.date-part =
    element cs:date-part {
      affixes, font-formatting, text-case, (day | month | year)
    }
  locale.terms = element cs:terms { terms.term+ }
  
  ## The "cs:term" element can either hold a basic string, or "cs:single" and
  ## "cs:multiple" child elements to give singular and plural forms of the term.
  terms.term =
    element cs:term {
      term.attributes,
      (text | (term.single, term.multiple))
    }
  term.attributes =
    (attribute name { terms },
     [ a:defaultValue = "long" ] attribute form { term.form }?)
    | (attribute name { terms.ordinals },
       attribute form { "long" }?,
       attribute gender-form { "masculine" | "feminine" }?,
       attribute match {
         "last-digit" | "last-two-digits" | "whole-number"
       }?)
    | (attribute name { terms.long-ordinals },
       attribute form { "long" }?,
       attribute gender-form { "masculine" | "feminine" })
    | (attribute name { terms.gender-assignable },
       attribute form { "long" }?,
       attribute gender { "masculine" | "feminine" })
  
  ## "verb-short" reverts to "verb" if the "verb-short" form is not available.
  ## "symbol" reverts to "short" if the "symbol" form is not available.
  ## "verb" and "short" revert to "long" if the specified form is not available.
  term.form = "long" | "verb" | "short" | "verb-short" | "symbol"
  term.single =
    
    ## Singular version of the term.
    element cs:single { text }
  term.multiple =
    
    ## Plural version of the term.
    element cs:multiple { text }
}
# ==============================================================================

## cs:macro
div {
  style.macro =
    
    ## Use to create collections of (reusable) formatting instructions.
    element cs:macro {
      attribute name { xsd:NMTOKEN },
      rendering-element+
    }
}
# ==============================================================================

## Rendering Elements
div {
  rendering-element =
    rendering-element.names
    | rendering-element.date
    | rendering-element.label
    | rendering-element.text
    | rendering-element.number
    | rendering-element.choose
    | rendering-element.group
}
# ==============================================================================

## cs:citation and cs:bibliography
div {
  style.citation =
    
    ## Use to describe the formatting of citations.
    element cs:citation { citation.options, sort?, citation.layout }
  style.bibliography =
    
    ## Use to describe the formatting of the bibliography.
    element cs:bibliography {
      bibliography.options, sort?, bibliography.layout
    }
  citation.layout =
    element cs:layout {
      affixes, delimiter, font-formatting, rendering-element+
    }
  bibliography.layout =
    element cs:layout { affixes, font-formatting, rendering-element+ }
}
# ==============================================================================

## cs:names Rendering Element
div {
  rendering-element.names =
    element cs:names {
      names.attributes,
      ((names.name?, names.et-al?) & names.label?),
      names.substitute?
    }
  names.attributes =
    attribute variable {
      list { variables.names+ }
    },
    affixes,
    
    ## Specify the delimiter for name lists of name variables rendered by
    ## the same cs:names element.
    delimiter,
    display,
    font-formatting
  names.name =
    element cs:name {
      name.attributes,
      
      ## Select the "long" (first name + last name, for Western names),
      ## "short" (last name only, for Western names), or "count" name form
      ## (returning the number of names in the name variable, which can be
      ## useful for some sorting algorithms).
      [ a:defaultValue = "long" ]
      attribute form { "long" | "short" | "count" }?,
      affixes,
      
      ## Set the delimiter for names in a name variable (e.g., ", " in
      ## "Doe, Smith")
      [ a:defaultValue = ", " ] delimiter,
      font-formatting,
      name.name-part*
    }
  name.attributes =
    
    ## Use to separate the second-to-last and last name of a name list by
    ## the "and" term or ampersand.
    attribute and {
      
      ## Use the "and" term (e.g., "Doe, Johnson and Smith").
      "text"
      | 
        ## Use the "ampersand" (e.g., "Doe, Johnson & Smith").
        "symbol"
    }?,
    
    ## Specify when the name delimiter is used between a truncated name list
    ## and the "et-al" (or "and others") term in case of et-al abbreviation
    ## (e.g., "Smith, Doe et al." or "Smith, Doe, et al.").
    [ a:defaultValue = "contextual" ]
    attribute delimiter-precedes-et-al {
      
      ## The name delimiter is only used when the truncated name list
      ## consists of two or more names.
      "contextual"
      | 
        ## The name delimiter is always used.
        "always"
      | 
        ## The name delimiter is never used.
        "never"
      | 
        ## The name delimiter is only used if the preceding name is inverted as
        ## a result of the "name-as-sort-order" attribute.
        "after-inverted-name"
    }?,
    
    ## Specify when the name delimiter is used between the second-to-last
    ## and last name of a non-truncated name list. Only has an effect when
    ## the "and" term or ampersand is used (e.g., "Doe and Smith" or "Doe,
    ## and Smith").
    [ a:defaultValue = "contextual" ]
    attribute delimiter-precedes-last {
      
      ## The name delimiter is only used when the name list consists of
      ## three or more names.
      "contextual"
      | 
        ## The name delimiter is always used.
        "always"
      | 
        ## The name delimiter is never used.
        "never"
      | 
        ## The name delimiter is only used if the preceding name is inverted as
        ## a result of the "name-as-sort-order" attribute.
        "after-inverted-name"
    }?,
    
    ## Set the minimum number of names needed in a name variable to activate
    ## et-al abbreviation.
    attribute et-al-min { xsd:integer }?,
    
    ## Set the number of names to render when et-al abbreviation is active.
    attribute et-al-use-first { xsd:integer }?,
    
    ## As "et-al-min", but only affecting subsequent citations to an item.
    attribute et-al-subsequent-min { xsd:integer }?,
    
    ## As "et-al-use-first", but only affecting subsequent citations to an
    ## item.
    attribute et-al-subsequent-use-first { xsd:integer }?,
    
    ## If set to "true", the "et-al" (or "and others") term is replaced by
    ## an ellipsis followed by the last name of the name variable.
    [ a:defaultValue = "false" ]
    attribute et-al-use-last { xsd:boolean }?,
    
    ## If set to "false", names are not initialized and "initialize-with"
    ## only affects initials already present in the input data.
    [ a:defaultValue = "true" ] attribute initialize { xsd:boolean }?,
    
    ## Activate initializing of given names. The attribute value is appended
    ## to each initial (e.g., with ". ", "Orson Welles" becomes "O. Welles").
    attribute initialize-with { text }?,
    
    ## Specify whether (and which) names should be rendered in their sort
    ## order (e.g., "Doe, John" instead of "John Doe").
    attribute name-as-sort-order {
      
      ## Render the first name of each name variable in sort order.
      "first"
      | 
        ## Render all names in sort order.
        "all"
    }?,
    
    ## Sets the delimiter for name-parts that have switched positions as a
    ## result of "name-as-sort-order" (e.g., ", " in "Doe, John").
    [ a:defaultValue = ", " ] attribute sort-separator { text }?
  name.name-part =
    
    ## Use to format individual name parts (e.g., "Jane DOE").
    element cs:name-part {
      attribute name { "family" | "given" },
      affixes,
      font-formatting,
      text-case
    }
  names.et-al =
    
    ## Specify the term used for et-al abbreviation and its formatting.
    element cs:et-al {
      
      ## Select the term to use for et-al abbreviation.
      [ a:defaultValue = "et-al" ]
      attribute term { "et-al" | "and others" }?,
      font-formatting
    }
  
  ## Inherits variable from the parent cs:names element.
  names.label =
    element cs:label {
      [ a:defaultValue = "long" ] attribute form { term.form }?,
      label.attributes-shared
    }
  names.substitute =
    
    ## Specify substitution options when the name variables selected on the
    ## parent cs:names element are empty.
    element cs:substitute { (substitute.names | rendering-element)+ }
  
  ## Short version of cs:names, without children, allowed in cs:substitute.
  substitute.names = element cs:names { names.attributes }
}
# ==============================================================================

## cs:date Rendering Element
div {
  rendering-element.date =
    element cs:date {
      attribute variable { variables.dates },
      ((
        ## Limit the date parts rendered.
        [ a:defaultValue = "year-month-day" ]
        attribute date-parts {
          
          ## Year, month and day
          "year-month-day"
          | 
            ## Year and month
            "year-month"
          | 
            ## Year only
            "year"
        }?,
        date.form,
        rendering-element.date.date-part.localized*)
       | (rendering-element.date.date-part.non-localized+, delimiter)),
      affixes,
      display,
      font-formatting,
      text-case
    }
  rendering-element.date.date-part.localized =
    
    ## Specify overriding formatting for localized dates (affixes
    ## cannot be overridden, as these are considered locale-specific).
    ## Example uses are forcing the use of leading-zeros, or of the
    ## "short" month form. Has no effect on which, and in what order,
    ## date parts are rendered.
    element cs:date-part {
      font-formatting, text-case, (day | month | year)
    }
  rendering-element.date.date-part.non-localized =
    
    ## Specify, in the desired order, the date parts that should be
    ## rendered and their formatting.
    element cs:date-part {
      affixes, font-formatting, text-case, (day | month | year)
    }
  day =
    attribute name { "day" },
    
    ## Day forms: "numeric" ("5"), "numeric-leading-zeros" ("05"), "ordinal"
    ## ("5th").
    [ a:defaultValue = "numeric" ]
    attribute form { "numeric" | "numeric-leading-zeros" | "ordinal" }?,
    range-delimiter
  month =
    attribute name { "month" },
    
    ## Months forms: "long" (e.g., "January"), "short" ("Jan."), "numeric"
    ## ("1"), and "numeric-leading-zeros" ("01").
    [ a:defaultValue = "long" ]
    attribute form {
      "long" | "short" | "numeric" | "numeric-leading-zeros"
    }?,
    range-delimiter,
    strip-periods
  year =
    attribute name { "year" },
    
    ## Year forms: "long" ("2005"), "short" ("05").
    [ a:defaultValue = "long" ] attribute form { "short" | "long" }?,
    range-delimiter
  range-delimiter =
    
    ## Specify a delimiter for date ranges (by default the en-dash). A custom
    ## delimiter is retrieved from the largest date part ("day", "month" or
    ## "year") that differs between the two dates.
    [ a:defaultValue = "–" ] attribute range-delimiter { text }?
}
# ==============================================================================

## cs:text Rendering Element
div {
  rendering-element.text =
    
    ## Use to call macros, render variables, terms, or verbatim text.
    element cs:text {
      text.attributes,
      affixes,
      display,
      font-formatting,
      quotes,
      strip-periods,
      text-case
    }
  text.attributes =
    
    ## Select a macro.
    attribute macro { xsd:NMTOKEN }
    | (
       ## Select a term.
       attribute term { terms },
       [ a:defaultValue = "long" ] attribute form { term.form }?,
       
       ## Specify term plurality: singular ("false") or plural ("true").
       [ a:defaultValue = "false" ] attribute plural { xsd:boolean }?)
    | 
      ## Specify verbatim text.
      attribute value { text }
    | (
       ## Select a variable.
       attribute variable { variables.standard },
       [ a:defaultValue = "long" ] attribute form { "short" | "long" }?)
}
# ==============================================================================

## cs:number Rendering Element
div {
  rendering-element.number =
    
    ## Use to render a number variable.
    element cs:number {
      number.attributes, affixes, display, font-formatting, text-case
    }
  number.attributes =
    attribute variable { variables.numbers },
    
    ## Number forms: "numeric" ("4"), "ordinal" ("4th"), "long-ordinal"
    ## ("fourth"), "roman" ("iv").
    [ a:defaultValue = "numeric" ]
    attribute form { "numeric" | "ordinal" | "long-ordinal" | "roman" }?
}
# ==============================================================================

## cs:label Rendering Element
div {
  rendering-element.label =
    
    ## Use to render a term whose pluralization depends on the content of a
    ## variable. E.g., if "page" variable holds a range, the plural label
    ## "pp." is selected instead of the singular "p.".
    element cs:label { label.attributes, label.attributes-shared }
  label.attributes =
    attribute variable { variables.numbers | "locator" | "page" },
    [ a:defaultValue = "long" ]
    attribute form { "long" | "short" | "symbol" }?
  label.attributes-shared =
    
    ## Specify when the plural version of a term is selected.
    [ a:defaultValue = "contextual" ]
    attribute plural { "always" | "never" | "contextual" }?,
    affixes,
    font-formatting,
    strip-periods,
    text-case
}
# ==============================================================================

## cs:group Rendering Element
div {
  rendering-element.group =
    
    ## Use to group rendering elements. Groups are useful for setting a
    ## delimiter for the group children, for organizing the layout of
    ## bibliographic entries (using the "display" attribute), and for
    ## suppressing the rendering of terms and verbatim text when variables
    ## are empty.
    element cs:group {
      group.attributes,
      affixes,
      delimiter,
      display,
      font-formatting,
      rendering-element+
    }
  group.attributes = notAllowed?
}
# ==============================================================================

## Style Options
div {
  style.options =
    style.demote-non-dropping-particle,
    style.initialize-with-hyphen,
    style.page-range-format,
    names-inheritable-options,
    name-inheritable-options
  citation.options =
    citation.cite-group-delimiter,
    citation.collapse-options,
    citation.disambiguate-options,
    citation.near-note-distance,
    names-inheritable-options,
    name-inheritable-options
  bibliography.options =
    bibliography.hanging-indent,
    bibliography.line-formatting-options,
    bibliography.second-field-align,
    bibliography.subsequent-author-substitute-options,
    names-inheritable-options,
    name-inheritable-options
  style.demote-non-dropping-particle =
    
    ## Specify whether the non-dropping particle is demoted in inverted
    ## names (e.g., "Koning, W. de").
    [ a:defaultValue = "display-and-sort" ]
    attribute demote-non-dropping-particle {
      "never" | "sort-only" | "display-and-sort"
    }?
  style.initialize-with-hyphen =
    
    ## Specify whether compound given names (e.g., "Jean-Luc") are
    ## initialized with ("J-L") or without a hyphen ("JL").
    [ a:defaultValue = "true" ]
    attribute initialize-with-hyphen { xsd:boolean }?
  style.page-range-format =
    
    ## Reformat page ranges in the "page" variable.
    attribute page-range-format {
      "expanded"
      | "minimal"
      | "minimal-two"
      | "chicago"
      | "chicago-15"
      | "chicago-16"
    }?
  citation.cite-group-delimiter =
    
    ## Activate cite grouping and specify the delimiter for cites within a
    ## cite group.
    [ a:defaultValue = ", " ] attribute cite-group-delimiter { text }?
  citation.collapse-options =
    
    ## Activate cite grouping and specify the method of citation collapsing.
    attribute collapse {
      
      ## Collapse ranges of numeric cites, e.g. from "[1,2,3]" to "[1-3]".
      "citation-number"
      | 
        ## Collapse cites by suppressing repeated names, e.g. from "(Doe
        ## 2000, Doe 2001)" to "(Doe 2000, 2001)".
        "year"
      | 
        ## Collapse cites as with "year", but also suppresses repeated
        ## years, e.g. from "(Doe 2000a, Doe 2000b)" to "(Doe 2000a, b)".
        "year-suffix"
      | 
        ## Collapses cites as with "year-suffix", but also collapses
        ## ranges of year-suffixes, e.g. from "(Doe 2000a, Doe 2000b,
        ## Doe 2000c)" to "(Doe 2000a-c)".
        "year-suffix-ranged"
    }?,
    
    ## Specify the delimiter between year-suffixes. Defaults to the cite
    ## delimiter.
    attribute year-suffix-delimiter { text }?,
    
    ## Specify the delimiter following a group of collapsed cites. Defaults
    ## to the cite delimiter.
    attribute after-collapse-delimiter { text }?
  citation.disambiguate-options =
    
    ## Set to "true" to activate disambiguation by showing names that were
    ## originally hidden as a result of et-al abbreviation.
    [ a:defaultValue = "false" ]
    attribute disambiguate-add-names { xsd:boolean }?,
    
    ## Set to "true" to activate disambiguation by expanding names, showing
    ## initials or full given names.
    [ a:defaultValue = "false" ]
    attribute disambiguate-add-givenname { xsd:boolean }?,
    
    ## Set to "true" to activate disambiguation by adding year-suffixes
    ## (e.g., "(Doe 2007a, Doe 2007b)") for items from the same author(s)
    ## and year.
    [ a:defaultValue = "false" ]
    attribute disambiguate-add-year-suffix { xsd:boolean }?,
    
    ## Specify how name are expanded for disambiguation.
    [ a:defaultValue = "by-cite" ]
    attribute givenname-disambiguation-rule {
      
      ## Each ambiguous names is progressively transformed until
      ## disambiguated (when disambiguation is not possible, the name
      ## remains in its original form).
      "all-names"
      | 
        ## As "all-names", but name expansion is limited to showing
        ## initials.
        "all-names-with-initials"
      | 
        ## As "all-names", but disambiguation is limited to the first name
        ## of each cite.
        "primary-name"
      | 
        ## As "all-names-with-initials", but disambiguation is limited to
        ## the first name of each cite.
        "primary-name-with-initials"
      | 
        ## As "all-names", but only ambiguous names in ambiguous cites are
        ## expanded.
        "by-cite"
    }?
  citation.near-note-distance =
    
    ## Set the number of preceding notes (footnotes or endnotes) within
    ## which the current item needs to have been previously cited in order
    ## for the "near-note" position to be "true".
    [ a:defaultValue = "5" ]
    attribute near-note-distance { xsd:integer }?
  bibliography.hanging-indent =
    
    ## Set to "true" to render bibliographic entries with hanging indents.
    [ a:defaultValue = "false" ]
    attribute hanging-indent { xsd:boolean }?
  bibliography.line-formatting-options =
    
    ## Set the spacing between bibliographic entries.
    [ a:defaultValue = "1" ]
    attribute entry-spacing { xsd:nonNegativeInteger }?,
    
    ## Set the spacing between bibliographic lines.
    [ a:defaultValue = "1" ]
    attribute line-spacing {
      xsd:integer { minExclusive = "0" }
    }?
  bibliography.second-field-align =
    
    ## Use to align any subsequent lines of bibliographic entries with the
    ## beginning of the second field.
    attribute second-field-align {
      
      ## Align the first field with the margin.
      "flush"
      | 
        ## Put the first field in the margin and align all subsequent
        ## lines of text with the margin.
        "margin"
    }?
  bibliography.subsequent-author-substitute-options =
    
    ## Substitute names that repeat in subsequent bibliographic entries by
    ## the attribute value.
    attribute subsequent-author-substitute { text }?,
    
    ## Specify the method of substitution of names repeated in subsequent
    ## bibliographic entries.
    [ a:defaultValue = "complete-all" ]
    attribute subsequent-author-substitute-rule {
      
      ## Requires a match of all rendered names in the name variable, and
      ## substitutes once for all names.
      "complete-all"
      | 
        ## Requires a match of all rendered names in the name variable,
        ## and substitutes for each name.
        "complete-each"
      | 
        ## Substitutes for each name, until the first mismatch.
        "partial-each"
      | 
        ## Substitutes the first name if it matches.
        "partial-first"
    }?
  
  ## Options affecting cs:names, for cs:style, cs:citation and cs:bibliography.
  names-inheritable-options =
    
    ## Inheritable name option, companion for "delimiter" on cs:names.
    attribute names-delimiter { text }?
  
  ## Options affecting cs:name, for cs:style, cs:citation and cs:bibliography.
  name-inheritable-options =
    name.attributes,
    
    ## Inheritable name option, companion for "delimiter" on cs:name.
    attribute name-delimiter { text }?,
    
    ## Inheritable name option, companion for "form" on cs:name.
    [ a:defaultValue = "long" ]
    attribute name-form { "long" | "short" | "count" }?
}
# ==============================================================================

## cs:sort - Sorting
div {
  sort =
    
    ## Specify how cites and bibliographic entries should be sorted. By
    ## default, items appear in the order in which they were cited.
    element cs:sort { sort.key+ }
  sort.key =
    element cs:key {
      (attribute variable { variables }
       | attribute macro { xsd:NMTOKEN }),
      
      ## The minimum number of names needed in a name variable to activate
      ## name list truncation. Overrides the values set on any
      ## "et-al-(subsequent-)min" attributes.
      attribute names-min { xsd:integer }?,
      
      ## The number of names to render when name list truncation is
      ## activated. Overrides the values set on the
      ## "et-al-(subsequent-)use-first" attributes.
      attribute names-use-first { xsd:integer }?,
      
      ## Use to override the value of the "et-at-use-last" attribute.
      attribute names-use-last { xsd:boolean }?,
      
      ## Select between an ascending and descending sort.
      [ a:defaultValue = "ascending" ]
      attribute sort { "ascending" | "descending" }?
    }
}
# ==============================================================================

## Formatting attributes.
div {
  affixes =
    [ a:defaultValue = "" ] attribute prefix { text }?,
    [ a:defaultValue = "" ] attribute suffix { text }?
  delimiter = attribute delimiter { text }?
  display =
    
    ## By default, bibliographic entries consist of continuous runs of text.
    ## With the "display" attribute, portions of each entry can be
    ## individually positioned.
    attribute display {
      
      ## Places the content in a block stretching from margin to margin.
      "block"
      | 
        ## Places the content in a block starting at the left margin.
        "left-margin"
      | 
        ## Places the content in a block to the right of a preceding
        ## "left-margin" block.
        "right-inline"
      | 
        ## Places the content in a block indented to the right by a standard
        ## amount.
        "indent"
    }?
  
  ## The font-formatting attributes are based on those of CSS and XSL-FO.
  font-formatting =
    [ a:defaultValue = "normal" ]
    attribute font-style { "italic" | "normal" | "oblique" }?,
    [ a:defaultValue = "normal" ]
    attribute font-variant { "normal" | "small-caps" }?,
    [ a:defaultValue = "normal" ]
    attribute font-weight { "normal" | "bold" | "light" }?,
    [ a:defaultValue = "none" ]
    attribute text-decoration { "none" | "underline" }?,
    [ a:defaultValue = "baseline" ]
    attribute vertical-align { "baseline" | "sup" | "sub" }?
  quotes =
    
    ## When set to "true", quotes are placed around the rendered text.
    [ a:defaultValue = "false" ] attribute quotes { xsd:boolean }?
  strip-periods =
    
    ## When set to "true", periods are removed from the rendered text.
    [ a:defaultValue = "false" ]
    attribute strip-periods { xsd:boolean }?
  text-case =
    attribute text-case {
      
      ## Renders text in lowercase.
      "lowercase"
      | 
        ## Renders text in uppercase.
        "uppercase"
      | 
        ## Capitalizes the first character (other characters remain in
        ## their original case).
        "capitalize-first"
      | 
        ## Capitalizes the first character of every word (other characters
        ## remain in their original case).
        "capitalize-all"
      | 
        ## Renders text in title case.
        "title"
      | 
        ## Renders text in sentence case.
        ## Deprecated. Will be removed in CSL 1.1
        "sentence"
    }?
}
`,
"csl-choose.rnc": `namespace a = "http://relaxng.org/ns/compatibility/annotations/1.0"
namespace cs = "http://purl.org/net/xbiblio/csl"


## cs:choose - Conditional Statements"
div {
  rendering-element.choose =
    
    ## Use to conditionally render rendering elements.
    element cs:choose { choose.if, choose.else-if*, choose.else? }
  choose.if = element cs:if { condition+, match, rendering-element* }
  choose.else-if =
    element cs:else-if { condition+, match, rendering-element* }
  choose.else = element cs:else { rendering-element+ }
  condition =
    
    ## If used, the element content is only rendered if it disambiguates two
    ## otherwise identical citations. This attempt at disambiguation is only
    ## made after all other disambiguation methods have failed.
    [ a:defaultValue = "true" ] attribute disambiguate { "true" }
    | 
      ## Tests whether the given variables contain numeric text.
      attribute is-numeric {
        list { variables+ }
      }
    | 
      ## Tests whether the given date variables contain approximate dates.
      attribute is-uncertain-date {
        list { variables.dates+ }
      }
    | 
      ## Tests whether the locator matches the given locator types.
      attribute locator {
        list { terms.locator+ }
      }
    | 
      ## Tests whether the cite position matches the given positions.
      attribute position {
        list {
          ("first"
           | "subsequent"
           | "ibid"
           | "ibid-with-locator"
           | "near-note")+
        }
      }
    | 
      ## Tests whether the item matches the given types.
      attribute type {
        list { item-types+ }
      }
    | 
      ## Tests whether the default ("long") forms of the given variables
      ## contain non-empty values.
      attribute variable {
        list { variables+ }
      }
  match =
    
    ## Set the testing logic.
    [ a:defaultValue = "all" ]
    attribute match {
      
      ## Element only tests "true" when all conditions test "true" for all
      ## given test values.
      "all"
      | 
        ## Element tests "true" when any condition tests "true" for any given
        ## test value.
        "any"
      | 
        ## Element only tests "true" when none of the conditions test "true"
        ## for any given test value.
        "none"
    }?
}
`,
"csl-terms.rnc": `namespace a = "http://relaxng.org/ns/compatibility/annotations/1.0"


## Terms
div {
  terms =
    terms.gender-assignable
    | terms.gender-variants
    | terms.locator
    | item-types
    | 
      ## Contributor roles
      variables.names
    | "editortranslator"
    | 
      ## Miscellaneous terms
      "accessed"
    | "ad"
    | "advance-online-publication"
    | "album"
    | "and"
    | "and others"
    | "anonymous"
    | "at"
    | "audio-recording"
    | "available at"
    | "bc"
    | "bce"
    | "by"
    | "ce"
    | "circa"
    | "cited"
    | "et-al"
    | "film"
    | "forthcoming"
    | "from"
    | "henceforth"
    | "ibid"
    | "in"
    | "in press"
    | "internet"
    | "interview"
    | "letter"
    | "loc-cit"
    | "no date"
    | "no-place"
    | "no-publisher"
    | "on"
    | "online"
    | "op-cit"
    | "original-work-published"
    | "personal-communication"
    | "podcast"
    | "podcast-episode"
    | "preprint"
    | "presented at"
    | "radio-broadcast"
    | "radio-series"
    | "radio-series-episode"
    | "reference"
    | "retrieved"
    | "review-of"
    | "scale"
    | "special-issue"
    | "special-section"
    | "television-broadcast"
    | "television-series"
    | "television-series-episode"
    | "video"
    | "working-paper"
    | 
      ## Punctuation
      "open-quote"
    | "close-quote"
    | "open-inner-quote"
    | "close-inner-quote"
    | "page-range-delimiter"
    | "colon"
    | "comma"
    | "semicolon"
    | 
      ## Seasons
      "season-01"
    | "season-02"
    | "season-03"
    | "season-04"
  
  ## Terms to which a gender may be assigned
  terms.gender-assignable =
    
    ## Months
    "month-01"
    | "month-02"
    | "month-03"
    | "month-04"
    | "month-05"
    | "month-06"
    | "month-07"
    | "month-08"
    | "month-09"
    | "month-10"
    | "month-11"
    | "month-12"
    | terms.non-locator-number-variables
    | terms.locator-number-variables
  
  ## Terms for which gender variants may be specified
  terms.gender-variants = terms.ordinals | terms.long-ordinals
  terms.ordinals =
    
    ## Ordinals
    xsd:string { pattern = "ordinal(-\\d{2})?" }
  terms.long-ordinals =
    
    ## Long ordinals
    "long-ordinal-01"
    | "long-ordinal-02"
    | "long-ordinal-03"
    | "long-ordinal-04"
    | "long-ordinal-05"
    | "long-ordinal-06"
    | "long-ordinal-07"
    | "long-ordinal-08"
    | "long-ordinal-09"
    | "long-ordinal-10"
  
  ## Locators
  terms.locator =
    "act"
    | "appendix"
    | "article-locator"
    | "book"
    | "canon"
    | "chapter"
    | "column"
    | "elocation"
    | "equation"
    | "figure"
    | "folio"
    | "line"
    | "note"
    | "opus"
    | "paragraph"
    | "rule"
    | "scene"
    | "sub-verbo"
    | "table"
    | "timestamp"
    | "title-locator"
    | "verse"
    | terms.locator-number-variables
  
  ## Locator terms with matching number variables
  terms.locator-number-variables =
    "issue"
    | "page"
    | "part"
    | "section"
    | "supplement"
    | "version"
    | "volume"
  
  ## Non-locator terms accompanying number variables
  terms.non-locator-number-variables =
    "chapter-number"
    | "citation-number"
    | "collection-number"
    | "edition"
    | "first-reference-note-number"
    | "number"
    | "number-of-pages"
    | "number-of-volumes"
    | "page-first"
    | "printing"
}
`,
"csl-types.rnc": `namespace a = "http://relaxng.org/ns/compatibility/annotations/1.0"


## Item types
div {
  item-types =
    "article"
    | "article-journal"
    | "article-magazine"
    | "article-newspaper"
    | "bill"
    | "book"
    | "broadcast"
    | "chapter"
    | "classic"
    | "collection"
    | "dataset"
    | "document"
    | "entry"
    | "entry-dictionary"
    | "entry-encyclopedia"
    | "event"
    | "figure"
    | "graphic"
    | "hearing"
    | "interview"
    | "legal_case"
    | "legislation"
    | "manuscript"
    | "map"
    | "motion_picture"
    | "musical_score"
    | "pamphlet"
    | "paper-conference"
    | "patent"
    | "performance"
    | "periodical"
    | "personal_communication"
    | "post"
    | "post-weblog"
    | "regulation"
    | "report"
    | "review"
    | "review-book"
    | "software"
    | "song"
    | "speech"
    | "standard"
    | "thesis"
    | "treaty"
    | "webpage"
}
`,
"csl-variables.rnc": `namespace a = "http://relaxng.org/ns/compatibility/annotations/1.0"


## Variables
div {
  
  ## All variables
  variables = variables.dates | variables.names | variables.standard
  
  ## Standard variables
  variables.standard =
    variables.numbers | variables.strings | variables.titles
  
  ## Date variables
  variables.dates =
    "accessed"
    | "available-date"
    | "event-date"
    | "issued"
    | "original-date"
    | "submitted"
  
  ## Name variables
  variables.names =
    "author"
    | "chair"
    | "collection-editor"
    | "compiler"
    | "composer"
    | "container-author"
    | "contributor"
    | "curator"
    | "director"
    | "editor"
    | "editor-translator"
    | "editorial-director"
    | "executive-producer"
    | "guest"
    | "host"
    | "illustrator"
    | "interviewer"
    | "narrator"
    | "organizer"
    | "original-author"
    | "performer"
    | "producer"
    | "recipient"
    | "reviewed-author"
    | "script-writer"
    | "series-creator"
    | "translator"
  
  ## Number variables
  variables.numbers =
    "chapter-number"
    | "citation-number"
    | "collection-number"
    | "edition"
    | "first-reference-note-number"
    | "issue"
    | "locator"
    | "number"
    | "number-of-pages"
    | "number-of-volumes"
    | "page"
    | "page-first"
    | "part-number"
    | "printing-number"
    | "section"
    | "supplement-number"
    | "version"
    | "volume"
  
  ## Title variables
  variables.titles =
    "collection-title"
    | "container-title"
    | "original-title"
    | "part-title"
    | "reviewed-title"
    | "title"
    | "volume-title"
    | # Short title forms. Will be removed in CSL 1.1
      "title-short"
    | "container-title-short"
  
  ## String variables
  variables.strings =
    "abstract"
    | "annote"
    | "archive"
    | "archive_collection"
    | "archive_location"
    | "archive-place"
    | "authority"
    | "call-number"
    | "citation-key"
    | "citation-label"
    | "dimensions"
    | "division"
    | "DOI"
    | # Alias for 'event-title'. Deprecated. Will be removed in CSL 1.1.
      "event"
    | "event-title"
    | "event-place"
    | "genre"
    | "ISBN"
    | "ISSN"
    | "jurisdiction"
    | "keyword"
    | "language"
    | "license"
    | "medium"
    | "note"
    | "original-publisher"
    | "original-publisher-place"
    | "PMCID"
    | "PMID"
    | "publisher"
    | "publisher-place"
    | "references"
    | "reviewed-genre"
    | "scale"
    | "source"
    | "status"
    | "URL"
    | "year-suffix"
}
`,
"csl-categories.rnc": `namespace a = "http://relaxng.org/ns/compatibility/annotations/1.0"


## Categories for style metadata
div {
  category.citation-format =
    "author" | "author-date" | "label" | "note" | "numeric"
  
  ## Use "generic-base" for styles that are non-discipline specific, such as
  ## APA, Harvard, etc.
  category.field =
    "anthropology"
    | "astronomy"
    | "biology"
    | "botany"
    | "chemistry"
    | "communications"
    | "engineering"
    | "generic-base"
    | "geography"
    | "geology"
    | "history"
    | "humanities"
    | "law"
    | "linguistics"
    | "literature"
    | "math"
    | "medicine"
    | "philosophy"
    | "physics"
    | "political_science"
    | "psychology"
    | "science"
    | "social_science"
    | "sociology"
    | "theology"
    | "zoology"
}
`
};