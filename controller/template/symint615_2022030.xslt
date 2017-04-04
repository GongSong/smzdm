<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output encoding="UTF-8" method="text" media-type="text/plain"/>
    <xsl:template match="/">
        [<xsl:apply-templates select="//li[@class='g-box por']"></xsl:apply-templates>]
    </xsl:template>
    <xsl:template match="li">
        <xsl:text>{"title":"</xsl:text>
        <xsl:value-of select="normalize-space(section/div/a)" />
        <xsl:text>",</xsl:text>
        <xsl:text>"price":"</xsl:text>
        <xsl:value-of select="section/p/span/b/label"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"originPrice":"</xsl:text>
        <xsl:value-of select="substring(section/p/span/s,1)"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"soldOut":</xsl:text>
        <xsl:choose>
            <xsl:when test="section/a/b[@class='sold-out']">
                <xsl:text>true</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>false</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>,</xsl:text>
        <xsl:text>"imgSrc":"</xsl:text>
        <xsl:value-of select="section/a/img/@src"/>
        <xsl:text>"}</xsl:text>
        <xsl:if test="position() &lt; last()">,</xsl:if>
    </xsl:template>
</xsl:stylesheet>