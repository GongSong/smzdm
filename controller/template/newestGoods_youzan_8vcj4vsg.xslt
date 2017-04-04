<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output encoding="UTF-8" method="text" media-type="text/plain"/>
    <xsl:template match="/">
        <xsl:text>[</xsl:text>
        <xsl:apply-templates select="//ul[@class='goods-list clearfix']/li"></xsl:apply-templates>
        <xsl:text>]</xsl:text>
    </xsl:template>
    <xsl:template match="li">
        <xsl:text>{"title":"</xsl:text>
        <xsl:value-of select="a/div[@class='title']" />
        <xsl:text>",</xsl:text>
        <xsl:text>"price":"</xsl:text>
        <xsl:value-of select="substring(a/span[@class='price'],3)"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"originPrice":"</xsl:text>
        <xsl:value-of select="substring(a/span[@class='origin-price'],6)"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"imgSrc":"</xsl:text>
        <xsl:value-of select="a/div[@class='image']/img/@src"/>
        <xsl:text>"}</xsl:text>
        <xsl:if test="position() &lt; last()">,</xsl:if>
    </xsl:template>
</xsl:stylesheet>